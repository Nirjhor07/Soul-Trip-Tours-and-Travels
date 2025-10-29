require('dotenv').config();
const mysql = require('mysql2/promise');

class AdminService {
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

  // Get all tours (including inactive)
  async getAllToursAdmin() {
    try {
      const [tours] = await this.pool.execute(`
        SELECT 
          t.*,
          c.name as category_name
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.created_at DESC
      `);
      
      return tours.map(tour => ({
        ...tour,
        highlights: tour.highlights ? tour.highlights.split(',') : []
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const [categories] = await this.pool.execute('SELECT * FROM categories ORDER BY name');
      return categories;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Create new tour
  async createTour(tourData) {
    try {
      const { title, destination, duration, price, image, category_id, description, route, highlights, featured } = tourData;
      
      const [result] = await this.pool.execute(`
        INSERT INTO tours 
        (title, destination, duration, price, image, category_id, description, route, highlights, featured, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
      `, [
        title, destination, duration, price, image, category_id, 
        description, route, highlights.join(','), featured ? 1 : 0
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Update tour
  async updateTour(tourId, tourData) {
    try {
      const { title, destination, duration, price, image, category_id, description, route, highlights, featured, status } = tourData;
      
      await this.pool.execute(`
        UPDATE tours SET 
        title = ?, destination = ?, duration = ?, price = ?, image = ?, 
        category_id = ?, description = ?, route = ?, highlights = ?, featured = ?, status = ?
        WHERE id = ?
      `, [
        title, destination, duration, price, image, category_id, 
        description, route, highlights.join(','), featured ? 1 : 0, status, tourId
      ]);
      
      return true;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Delete tour (soft delete)
  async deleteTour(tourId) {
    try {
      await this.pool.execute(`UPDATE tours SET status = 'Inactive' WHERE id = ?`, [tourId]);
      return true;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Get tour by ID for editing
  async getTourByIdAdmin(tourId) {
    try {
      const [tours] = await this.pool.execute(`
        SELECT 
          t.*,
          c.name as category_name
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
      `, [tourId]);
      
      if (tours.length === 0) return null;
      
      const tour = tours[0];
      return {
        ...tour,
        highlights: tour.highlights ? tour.highlights.split(',') : []
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const [tourStats] = await this.pool.execute(`
        SELECT 
          COUNT(*) as total_tours,
          COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_tours,
          COUNT(CASE WHEN featured = 1 THEN 1 END) as featured_tours
        FROM tours
      `);

      const [bookingStats] = await this.pool.execute(`
        SELECT 
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_bookings,
          COUNT(CASE WHEN status = 'Confirmed' THEN 1 END) as confirmed_bookings
        FROM bookings
      `);

      const [inquiryStats] = await this.pool.execute(`
        SELECT 
          COUNT(*) as total_inquiries,
          COUNT(CASE WHEN status = 'New' THEN 1 END) as new_inquiries
        FROM contact_inquiries
      `);

      return {
        tours: tourStats[0],
        bookings: bookingStats[0],
        inquiries: inquiryStats[0]
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get recent bookings
  async getRecentBookings() {
    try {
      const [bookings] = await this.pool.execute(`
        SELECT 
          b.*,
          t.title as tour_title
        FROM bookings b
        LEFT JOIN tours t ON b.tour_id = t.id
        ORDER BY b.created_at DESC
        LIMIT 10
      `);
      
      return bookings;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Get recent contact inquiries
  async getRecentInquiries() {
    try {
      const [inquiries] = await this.pool.execute(`
        SELECT *
        FROM contact_inquiries
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      return inquiries;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = AdminService;