-- Seed data for Soul Trip Tours
USE soultrip;

-- Insert tour data based on existing static data
INSERT INTO tours (id, title, destination, duration, price, image, category_id, description, route) VALUES 
(1, 'Himalayan Adventure Trek', 'Nepal', '15 days', 1899.00, 'himalayas.jpg', 1, 'Experience the breathtaking beauty of the Himalayas with our expert guides.', 'Kathmandu to Everest Base Camp'),
(2, 'African Safari Experience', 'Kenya & Tanzania', '12 days', 2499.00, 'safari.jpg', 3, 'Witness the Great Migration and explore the wild heart of Africa.', 'Nairobi to Serengeti'),
(3, 'Mystical India Journey', 'India', '14 days', 1699.00, 'india.jpg', 2, 'Discover the rich heritage and diverse culture of incredible India.', 'Delhi to Mumbai'),
(4, 'European Grand Tour', 'Europe', '21 days', 3299.00, 'europe.jpg', 5, 'Explore the historic cities and cultural treasures of Europe.', 'London to Rome'),
(5, 'Amazon Rainforest Expedition', 'Brazil', '10 days', 2199.00, 'amazon.jpg', 4, 'Dive deep into the world\'s largest rainforest ecosystem.', 'Manaus to Iquitos'),
(6, 'Southeast Asian Discovery', 'Thailand & Vietnam', '18 days', 2099.00, 'southeast-asia.jpg', 2, 'Experience the vibrant cultures and stunning landscapes of Southeast Asia.', 'Bangkok to Ho Chi Minh City');

-- Insert tour highlights
INSERT INTO tour_highlights (tour_id, highlight, order_index) VALUES 
-- Himalayan Adventure Trek highlights
(1, 'Everest Base Camp', 1),
(1, 'Sherpa Culture', 2),
(1, 'Mountain Views', 3),
(1, 'Ancient Monasteries', 4),

-- African Safari Experience highlights
(2, 'Big Five', 1),
(2, 'Great Migration', 2),
(2, 'Maasai Culture', 3),
(2, 'Serengeti', 4),

-- Mystical India Journey highlights
(3, 'Taj Mahal', 1),
(3, 'Rajasthan Palaces', 2),
(3, 'Spiritual Sites', 3),
(3, 'Local Cuisine', 4),

-- European Grand Tour highlights
(4, 'Historic Cities', 1),
(4, 'Art Museums', 2),
(4, 'Local Cuisine', 3),
(4, 'Architecture', 4),

-- Amazon Rainforest Expedition highlights
(5, 'Wildlife Spotting', 1),
(5, 'River Cruises', 2),
(5, 'Indigenous Culture', 3),
(5, 'Biodiversity', 4),

-- Southeast Asian Discovery highlights
(6, 'Ancient Temples', 1),
(6, 'Street Food', 2),
(6, 'Floating Markets', 3),
(6, 'Beach Relaxation', 4);

-- Insert primary tour images into gallery
INSERT INTO tour_gallery (tour_id, image_url, alt_text, is_primary, order_index) VALUES 
(1, 'https://images.unsplash.com/photo-1506905925346-21472746e650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Himalayan Adventure Trek', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'African Safari Experience', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Mystical India Journey', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'European Grand Tour', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Amazon Rainforest Expedition', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1552733407-6d4c3b2ef16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Southeast Asian Discovery', TRUE, 1);

-- Insert default pricing
INSERT INTO tour_pricing (tour_id, season, price, valid_from, valid_to, is_active) VALUES 
(1, 'Standard', 1899.00, '2025-01-01', '2025-12-31', TRUE),
(2, 'Standard', 2499.00, '2025-01-01', '2025-12-31', TRUE),
(3, 'Standard', 1699.00, '2025-01-01', '2025-12-31', TRUE),
(4, 'Standard', 3299.00, '2025-01-01', '2025-12-31', TRUE),
(5, 'Standard', 2199.00, '2025-01-01', '2025-12-31', TRUE),
(6, 'Standard', 2099.00, '2025-01-01', '2025-12-31', TRUE);

-- Update tours to mark some as featured
UPDATE tours SET featured = TRUE WHERE id IN (1, 2, 3);

-- Reset AUTO_INCREMENT to ensure consistent IDs
ALTER TABLE tours AUTO_INCREMENT = 7;