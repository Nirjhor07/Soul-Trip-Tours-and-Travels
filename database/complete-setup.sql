-- Complete Soul Trip Tours Database Export
-- Generated for deployment and development setup

-- Create database
CREATE DATABASE IF NOT EXISTS soultrip;
USE soultrip;

-- Set charset
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Categories table
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert categories
INSERT INTO categories (id, name, description) VALUES 
(1, 'Adventure', 'High-energy outdoor activities and extreme sports'),
(2, 'Cultural', 'Immersive cultural experiences and heritage tours'),
(3, 'Wildlife', 'Nature and wildlife observation tours'),
(4, 'Eco-Tourism', 'Sustainable and environmentally conscious travel'),
(5, 'Urban', 'City tours and metropolitan experiences'),
(6, 'Spiritual', 'Religious and spiritual journey tours');

-- Tours table
DROP TABLE IF EXISTS tours;
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description TEXT NOT NULL,
    route VARCHAR(255),
    max_participants INT DEFAULT 16,
    min_participants INT DEFAULT 2,
    difficulty_level ENUM('Easy', 'Moderate', 'Challenging', 'Expert') DEFAULT 'Moderate',
    status ENUM('Active', 'Inactive', 'Draft') DEFAULT 'Active',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Insert sample tours
INSERT INTO tours (title, destination, duration, price, image, category_id, description, route, difficulty_level, featured) VALUES 
('Himalayan Adventure Trek', 'Nepal', '15 days', 1899.00, 'himalayas.jpg', 1, 'Experience the breathtaking beauty of the Himalayas with our expert guides. Trek through ancient villages, witness stunning mountain vistas, and immerse yourself in local Sherpa culture.', 'Kathmandu to Everest Base Camp', 'Challenging', TRUE),

('African Safari Experience', 'Kenya & Tanzania', '12 days', 2499.00, 'safari.jpg', 3, 'Witness the Great Migration and explore the wild heart of Africa. See lions, elephants, and countless other species in their natural habitat.', 'Nairobi to Serengeti', 'Moderate', TRUE),

('Mystical India Journey', 'India', '14 days', 1699.00, 'india.jpg', 2, 'Discover the rich heritage and diverse culture of incredible India. Visit ancient temples, bustling markets, and experience authentic local traditions.', 'Delhi to Mumbai', 'Easy', FALSE),

('European Grand Tour', 'Europe', '21 days', 3299.00, 'europe.jpg', 5, 'Explore the historic cities and cultural treasures of Europe. From ancient Rome to modern Paris, experience the best of European civilization.', 'London to Rome', 'Easy', TRUE),

('Amazon Rainforest Expedition', 'Brazil', '10 days', 2199.00, 'amazon.jpg', 4, 'Dive deep into the world\'s largest rainforest ecosystem. Spot exotic wildlife, meet indigenous communities, and learn about conservation efforts.', 'Manaus to Iquitos', 'Moderate', FALSE),

('Southeast Asian Discovery', 'Thailand & Vietnam', '18 days', 2099.00, 'southeast-asia.jpg', 2, 'Experience the vibrant cultures and stunning landscapes of Southeast Asia. From temple hopping to street food tours, discover the real Asia.', 'Bangkok to Ho Chi Minh City', 'Easy', FALSE);

-- Bookings table
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    travelers INT NOT NULL DEFAULT 1,
    travel_date DATE,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
);

-- Contacts table
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, category, description) VALUES 
('site_title', 'Soul Trip Tours', 'general', 'Website title'),
('site_tagline', 'Discover. Explore. Experience.', 'general', 'Website tagline'),
('contact_email', 'info@soultriptours.com', 'contact', 'Primary contact email'),
('contact_phone', '+1 (555) 123-4567', 'contact', 'Primary contact phone'),
('business_hours', 'Mon-Fri 9AM-6PM, Sat 9AM-4PM', 'contact', 'Business operating hours'),
('hero_title', 'Adventure Awaits', 'homepage', 'Main hero section title'),
('hero_subtitle', 'Discover breathtaking destinations and create unforgettable memories', 'homepage', 'Hero section subtitle'),
('about_company', 'Soul Trip Tours is your gateway to extraordinary adventures around the world.', 'about', 'Company description');

-- About content table
DROP TABLE IF EXISTS about_content;
CREATE TABLE about_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert about content
INSERT INTO about_content (section_key, section_title, content, order_index) VALUES 
('mission', 'Our Mission', 'To create transformative travel experiences that connect people with diverse cultures, breathtaking landscapes, and unforgettable adventures while promoting sustainable tourism practices.', 1),
('vision', 'Our Vision', 'To be the leading travel company that inspires wanderlust and creates meaningful connections between travelers and the world around them.', 2),
('story', 'Our Story', 'Founded with a passion for exploration and discovery, Soul Trip Tours began as a small venture dedicated to sharing the beauty of hidden destinations with fellow travelers.', 3);

-- Team members table
DROP TABLE IF EXISTS team_members;
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert team members
INSERT INTO team_members (name, position, bio, order_index) VALUES 
('Sarah Johnson', 'Founder & CEO', 'With over 15 years of travel industry experience, Sarah founded Soul Trip Tours to share her passion for authentic travel experiences.', 1),
('Michael Chen', 'Head of Operations', 'Michael ensures every tour runs smoothly, bringing his expertise in logistics and customer service to create seamless adventures.', 2),
('Emma Rodriguez', 'Cultural Experience Specialist', 'Emma designs our cultural immersion programs, leveraging her anthropology background and extensive travel experience.', 3),
('David Kim', 'Adventure Guide Coordinator', 'David leads our adventure tourism initiatives and coordinates with local guides worldwide to ensure safe and exciting experiences.', 4);

-- Company stats table
DROP TABLE IF EXISTS company_stats;
CREATE TABLE company_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_name VARCHAR(255) NOT NULL,
    stat_value VARCHAR(100) NOT NULL,
    stat_label VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert company stats
INSERT INTO company_stats (stat_name, stat_value, stat_label, order_index) VALUES 
('tours_completed', '500+', 'Tours Completed', 1),
('happy_travelers', '2000+', 'Happy Travelers', 2),
('destinations', '25+', 'Destinations', 3),
('years_experience', '10+', 'Years Experience', 4);

-- Company values table
DROP TABLE IF EXISTS company_values;
CREATE TABLE company_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert company values
INSERT INTO company_values (value_name, description, icon, order_index) VALUES 
('Authenticity', 'We believe in genuine, immersive experiences that showcase the true essence of each destination.', 'fas fa-heart', 1),
('Sustainability', 'We are committed to responsible tourism that benefits local communities and preserves natural environments.', 'fas fa-leaf', 2),
('Safety', 'Your safety is our top priority. We maintain the highest standards of safety protocols and work with certified guides.', 'fas fa-shield-alt', 3),
('Excellence', 'We strive for excellence in every aspect of our service, from planning to execution.', 'fas fa-star', 4);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;