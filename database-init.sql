-- Soul Trip Tours Database Schema
-- This script creates all necessary tables for the Soul Trip Tours website

CREATE DATABASE IF NOT EXISTS soultrip;
USE soultrip;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Adventure', 'Thrilling outdoor adventures and extreme sports'),
(2, 'Cultural', 'Cultural tours and heritage experiences'),
(3, 'Nature', 'Nature tours and wildlife experiences'),
(4, 'Spiritual', 'Spiritual journeys and meditation retreats'),
(5, 'Luxury', 'Luxury travel experiences with premium services'),
(6, 'Budget', 'Budget-friendly tours for cost-conscious travelers');

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tour highlights table
CREATE TABLE IF NOT EXISTS tour_highlights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id INT NOT NULL,
  highlight TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  travel_date DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  special_requirements TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id)
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('New', 'Read', 'Replied') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample tour data
INSERT IGNORE INTO tours (title, description, price, duration, location, category_id, image_url, featured) VALUES
('Himalayan Adventure Trek', 'Experience the breathtaking beauty of the Himalayas with our guided trekking adventure. Perfect for adventure enthusiasts looking for an unforgettable journey.', 1299.99, '12 days', 'Nepal Himalayas', 1, '/images/himalayas.jpg', TRUE),
('Cultural Heritage of Nepal', 'Discover the rich cultural heritage of Nepal with visits to ancient temples, palaces, and traditional villages.', 899.99, '8 days', 'Kathmandu Valley', 2, '/images/cultural.jpg', TRUE),
('Chitwan National Park Safari', 'Explore the wildlife of Chitwan National Park with jungle safaris, elephant rides, and bird watching.', 599.99, '4 days', 'Chitwan, Nepal', 3, '/images/safari.jpg', FALSE);

-- Sample highlights
INSERT IGNORE INTO tour_highlights (tour_id, highlight) VALUES
(1, 'Professional mountain guides'),
(1, 'All meals and accommodation included'),
(1, 'Spectacular mountain views'),
(1, 'Cultural village visits'),
(2, 'UNESCO World Heritage Sites'),
(2, 'Traditional architecture'),
(2, 'Local cultural performances'),
(2, 'Authentic Nepali cuisine'),
(3, 'Jungle safari adventures'),
(3, 'Elephant back rides'),
(3, 'Bird watching tours'),
(3, 'Canoe trips');