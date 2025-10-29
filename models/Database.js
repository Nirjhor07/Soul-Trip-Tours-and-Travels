require('dotenv').config();
const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  // Execute query with connection pooling
  async query(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Get all tours with category information
  async getAllTours() {
    const sql = `
      SELECT 
        t.*,
        c.name as category,
        GROUP_CONCAT(th.highlight ORDER BY th.order_index) as highlights,
        tg.image_url as primary_image
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN tour_highlights th ON t.id = th.tour_id
      LEFT JOIN tour_gallery tg ON t.id = tg.tour_id AND tg.is_primary = TRUE
      WHERE t.status = 'Active'
      GROUP BY t.id
      ORDER BY t.featured DESC, t.created_at DESC
    `;
    
    const tours = await this.query(sql);
    
    // Format highlights as array
    return tours.map(tour => ({
      ...tour,
      highlights: tour.highlights ? tour.highlights.split(',') : [],
      image: tour.primary_image || tour.image
    }));
  }

  // Get tour by ID with all details
  async getTourById(id) {
    const sql = `
      SELECT 
        t.*,
        c.name as category,
        tg.image_url as primary_image
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN tour_gallery tg ON t.id = tg.tour_id AND tg.is_primary = TRUE
      WHERE t.id = ? AND t.status = 'Active'
    `;
    
    const [tour] = await this.query(sql, [id]);
    if (!tour) return null;

    // Get highlights
    const highlightsSql = `
      SELECT highlight FROM tour_highlights 
      WHERE tour_id = ? 
      ORDER BY order_index
    `;
    const highlights = await this.query(highlightsSql, [id]);
    
    // Get all images
    const imagesSql = `
      SELECT image_url, alt_text, is_primary 
      FROM tour_gallery 
      WHERE tour_id = ? 
      ORDER BY order_index
    `;
    const images = await this.query(imagesSql, [id]);

    return {
      ...tour,
      highlights: highlights.map(h => h.highlight),
      images: images,
      image: tour.primary_image || tour.image
    };
  }

  // Get tours by category
  async getToursByCategory(categoryName) {
    const sql = `
      SELECT 
        t.*,
        c.name as category,
        GROUP_CONCAT(th.highlight ORDER BY th.order_index) as highlights,
        tg.image_url as primary_image
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN tour_highlights th ON t.id = th.tour_id
      LEFT JOIN tour_gallery tg ON t.id = tg.tour_id AND tg.is_primary = TRUE
      WHERE c.name = ? AND t.status = 'Active'
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;
    
    const tours = await this.query(sql, [categoryName]);
    
    return tours.map(tour => ({
      ...tour,
      highlights: tour.highlights ? tour.highlights.split(',') : [],
      image: tour.primary_image || tour.image
    }));
  }

  // Get all categories
  async getCategories() {
    const sql = 'SELECT * FROM categories ORDER BY name';
    return await this.query(sql);
  }

  // Add a new booking
  async addBooking(bookingData) {
    const sql = `
      INSERT INTO bookings 
      (tour_id, customer_name, customer_email, customer_phone, preferred_date, participants, total_cost, special_requests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const { tourId, name, email, phone, date, participants, specialRequests } = bookingData;
    
    // Calculate total cost
    const tour = await this.getTourById(tourId);
    const totalCost = tour ? tour.price * participants : 0;
    
    const result = await this.query(sql, [
      tourId, name, email, phone, date, participants, totalCost, specialRequests
    ]);
    
    return result.insertId;
  }

  // Add contact inquiry
  async addContactInquiry(inquiryData) {
    const sql = `
      INSERT INTO contact_inquiries 
      (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const { name, email, phone, subject, message } = inquiryData;
    const result = await this.query(sql, [name, email, phone, subject, message]);
    
    return result.insertId;
  }

  // Admin methods for CRUD operations
  
  // Create new tour
  async createTour(tourData) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert tour
      const tourSql = `
        INSERT INTO tours 
        (title, destination, duration, price, image, category_id, description, route, max_participants, difficulty_level, status, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [tourResult] = await connection.execute(tourSql, [
        tourData.title, tourData.destination, tourData.duration, tourData.price,
        tourData.image, tourData.category_id, tourData.description, tourData.route,
        tourData.max_participants, tourData.difficulty_level, tourData.status, tourData.featured
      ]);
      
      const tourId = tourResult.insertId;
      
      // Insert highlights
      if (tourData.highlights && tourData.highlights.length > 0) {
        const highlightSql = 'INSERT INTO tour_highlights (tour_id, highlight, order_index) VALUES (?, ?, ?)';
        
        for (let i = 0; i < tourData.highlights.length; i++) {
          await connection.execute(highlightSql, [tourId, tourData.highlights[i], i + 1]);
        }
      }
      
      // Insert primary image into gallery
      if (tourData.primary_image) {
        const gallerySql = 'INSERT INTO tour_gallery (tour_id, image_url, alt_text, is_primary, order_index) VALUES (?, ?, ?, TRUE, 1)';
        await connection.execute(gallerySql, [tourId, tourData.primary_image, tourData.title]);
      }
      
      await connection.commit();
      return tourId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update tour
  async updateTour(tourId, tourData) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update tour
      const tourSql = `
        UPDATE tours SET 
        title = ?, destination = ?, duration = ?, price = ?, image = ?, 
        category_id = ?, description = ?, route = ?, max_participants = ?, 
        difficulty_level = ?, status = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await connection.execute(tourSql, [
        tourData.title, tourData.destination, tourData.duration, tourData.price,
        tourData.image, tourData.category_id, tourData.description, tourData.route,
        tourData.max_participants, tourData.difficulty_level, tourData.status, tourData.featured,
        tourId
      ]);
      
      // Update highlights (delete and re-insert)
      await connection.execute('DELETE FROM tour_highlights WHERE tour_id = ?', [tourId]);
      
      if (tourData.highlights && tourData.highlights.length > 0) {
        const highlightSql = 'INSERT INTO tour_highlights (tour_id, highlight, order_index) VALUES (?, ?, ?)';
        
        for (let i = 0; i < tourData.highlights.length; i++) {
          await connection.execute(highlightSql, [tourId, tourData.highlights[i], i + 1]);
        }
      }
      
      await connection.commit();
      return true;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete tour (soft delete)
  async deleteTour(tourId) {
    const sql = "UPDATE tours SET status = 'Inactive' WHERE id = ?";
    await this.query(sql, [tourId]);
    return true;
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

module.exports = Database;