require('dotenv').config();
const mysql = require('mysql2/promise');

class TourService {
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

  async getAllTours() {
    try {
      const [tours] = await this.pool.execute(`
        SELECT 
          t.*,
          c.name as category
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.status = 'Active'
        ORDER BY t.featured DESC, t.created_at DESC
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

  async getTourById(id) {
    try {
      const [tours] = await this.pool.execute(`
        SELECT 
          t.*,
          c.name as category
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ? AND t.status = 'Active'
      `, [id]);
      
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

  async getToursByCategory(categoryName) {
    try {
      const [tours] = await this.pool.execute(`
        SELECT 
          t.*,
          c.name as category
        FROM tours t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE c.name = ? AND t.status = 'Active'
        ORDER BY t.created_at DESC
      `, [categoryName]);
      
      return tours.map(tour => ({
        ...tour,
        highlights: tour.highlights ? tour.highlights.split(',') : []
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async addBooking(bookingData) {
    try {
      const { tourId, name, email, phone, date, participants, specialRequests } = bookingData;
      
      // Get tour price
      const tour = await this.getTourById(tourId);
      const totalCost = tour ? tour.price * participants : 0;
      
      // Convert undefined and empty values to null for MySQL
      const params = [
        tourId === undefined ? null : tourId,
        name === undefined ? null : name,
        email === undefined ? null : email,
        phone === undefined ? null : phone,
        (date === undefined || date === '' || !date) ? null : date,
        participants === undefined ? null : participants,
        totalCost === undefined ? null : totalCost,
        specialRequests === undefined ? null : specialRequests
      ];
      
      const [result] = await this.pool.execute(`
        INSERT INTO bookings 
        (tour_id, customer_name, customer_email, customer_phone, preferred_date, participants, total_cost, special_requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, params);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async addContactInquiry(inquiryData) {
    try {
      const { name, email, phone, subject, message } = inquiryData;
      
      const [result] = await this.pool.execute(`
        INSERT INTO contact_inquiries 
        (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `, [name, email, phone, subject, message]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = TourService;