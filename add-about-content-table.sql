-- Add About Content Management Table
USE soultrip;

-- About content sections table
CREATE TABLE IF NOT EXISTS about_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    section_title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About team members table
CREATE TABLE IF NOT EXISTS about_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About statistics table
CREATE TABLE IF NOT EXISTS about_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(100) NOT NULL UNIQUE,
    stat_value VARCHAR(50) NOT NULL,
    stat_label VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default about content
INSERT IGNORE INTO about_content (section_key, section_title, content, order_index) VALUES 
('hero_title', 'Hero Title', 'About Soul Trip', 1),
('hero_subtitle', 'Hero Subtitle', 'Creating unforgettable travel experiences since 2025', 2),
('story_title', 'Our Story Title', 'Our Story', 3),
('story_content', 'Our Story Content', 'Soul Trip Tours and Travels was born from a passion for adventure and a deep belief that travel has the power to transform lives. Founded in 2025, we\'ve been dedicated to creating small group & large group adventures that bring the world closer and create lasting connections between travelers and destinations.', 4),
('mission_title', 'Mission Title', 'Our Mission', 5),
('mission_content', 'Mission Content', 'We believe that travel should be more than just visiting places – it should be about connecting with cultures, understanding different perspectives, and creating memories that last a lifetime. Our mission is to provide authentic, immersive travel experiences that respect local communities and environments.', 6),
('values_title', 'Values Title', 'Our Values', 7),
('values_subtitle', 'Values Subtitle', 'These core principles guide everything we do and shape the way we approach travel.', 8),
('team_title', 'Team Title', 'Meet Our Team', 9),
('team_subtitle', 'Team Subtitle', 'The passionate individuals behind your unforgettable adventures.', 10),
('cta_title', 'Call to Action Title', 'Ready to Start Your Soul Trip?', 11),
('cta_content', 'Call to Action Content', 'Join us on an adventure that will touch your soul and create memories to last a lifetime.', 12);

-- Insert default team members
INSERT IGNORE INTO about_team (name, position, bio, image_url, order_index) VALUES 
('Sammi Akter', 'Founder & Proprietor', 'With over 15 years of travel industry experience, Sammi Akter founded Soul Trip to create meaningful travel experiences that connect people and cultures.', '/images/sammi-mam.jpg', 1),
('Sarah Chen', 'Operations Director', 'Sarah ensures every detail of your trip runs smoothly. Her expertise in logistics and local partnerships makes magic happen behind the scenes.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2),
('Marcus Rodriguez', 'Adventure Specialist', 'Marcus designs our most thrilling adventures. His passion for outdoor activities and cultural exploration creates unforgettable experiences.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3);

-- Insert default statistics
INSERT IGNORE INTO about_stats (stat_key, stat_value, stat_label, order_index) VALUES 
('travelers', '5000+', 'Happy Travelers', 1),
('destinations', '50+', 'Destinations', 2),
('rating', '4.9', 'Average Rating', 3),
('tours', '100+', 'Tour Options', 4);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_about_content_section ON about_content(section_key);
CREATE INDEX IF NOT EXISTS idx_about_content_order ON about_content(order_index);
CREATE INDEX IF NOT EXISTS idx_about_team_order ON about_team(order_index);
CREATE INDEX IF NOT EXISTS idx_about_stats_order ON about_stats(order_index);
