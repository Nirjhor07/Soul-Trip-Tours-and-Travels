-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: soultrip
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `about_content`
--

DROP TABLE IF EXISTS `about_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_key` varchar(100) NOT NULL,
  `section_title` varchar(255) NOT NULL,
  `content` text,
  `image_url` varchar(500) DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_key` (`section_key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_content`
--

LOCK TABLES `about_content` WRITE;
/*!40000 ALTER TABLE `about_content` DISABLE KEYS */;
INSERT INTO `about_content` VALUES (1,'hero_title','Hero Title','About Soul Trip',NULL,1,1,'2025-10-01 16:11:55','2025-10-01 16:11:55'),(2,'hero_subtitle','Hero Subtitle','Creating unforgettable travel experiences since 2025',NULL,2,1,'2025-10-01 16:11:55','2025-10-01 16:11:55'),(3,'story_title','Our Story Title','Our Story',NULL,3,1,'2025-10-01 16:11:55','2025-10-01 16:11:55'),(4,'story_content','Our Story Content','Soul Trip Tours and Travels was born from a passion for adventure and a deep belief that travel has the power to transform lives. Founded in 2025, we\'ve been dedicated to creating small group & large group adventures that bring the world closer and create lasting connections between travelers and destinations.',NULL,4,1,'2025-10-01 16:11:55','2025-10-01 16:44:02'),(5,'mission_title','Mission Title','Our Mission',NULL,5,1,'2025-10-01 16:11:55','2025-10-01 16:11:55'),(6,'mission_content','Mission Content','We believe that travel should be more than just visiting places – it should be about connecting with cultures, understanding different perspectives, and creating memories that last a lifetime. Our mission is to provide authentic, immersive travel experiences that respect local communities and environment.',NULL,6,1,'2025-10-01 16:11:55','2025-10-01 16:44:16'),(7,'values_title','Values Title','Our Values',NULL,7,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(8,'values_subtitle','Values Subtitle','These core principles guide everything we do and shape the way we approach travel.',NULL,8,1,'2025-10-01 16:24:05','2025-10-01 16:24:05');
/*!40000 ALTER TABLE `about_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_stats`
--

DROP TABLE IF EXISTS `about_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stat_key` varchar(100) NOT NULL,
  `stat_value` varchar(50) NOT NULL,
  `stat_label` varchar(255) NOT NULL,
  `order_index` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stat_key` (`stat_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_stats`
--

LOCK TABLES `about_stats` WRITE;
/*!40000 ALTER TABLE `about_stats` DISABLE KEYS */;
INSERT INTO `about_stats` VALUES (1,'travelers','5000+','Happy Travelers',1,1,'2025-10-01 16:11:56','2025-10-01 16:11:56'),(2,'destinations','50+','Destinations',2,1,'2025-10-01 16:11:56','2025-10-01 16:11:56'),(3,'rating','4.9','Average Rating',3,1,'2025-10-01 16:11:56','2025-10-01 16:11:56'),(4,'tours','100+','Tour Options',4,1,'2025-10-01 16:11:56','2025-10-01 16:11:56');
/*!40000 ALTER TABLE `about_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_team`
--

DROP TABLE IF EXISTS `about_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `bio` text,
  `image_url` varchar(500) DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_team`
--

LOCK TABLES `about_team` WRITE;
/*!40000 ALTER TABLE `about_team` DISABLE KEYS */;
INSERT INTO `about_team` VALUES (1,'Sammi Akter','Founder & Proprietor','With over 15 years of travel industry experience, Sammi Akter founded Soul Trip to create meaningful travel experiences that connect people and cultures.','/images/sammi-mam.jpg',1,1,'2025-10-01 16:11:55','2025-10-01 16:11:55'),(2,'Nirjhor Akash','Developer','Just a recent graduate developed this page.','/uploads/team/team-1761676762441-894852169.jpg',2,1,'2025-10-01 16:11:55','2025-10-28 18:39:22'),(3,'Marcus Rodriguez','Adventure Specialist','Marcus designs our most thrilling adventures. His passion for outdoor activities and cultural exploration creates unforgettable experiences.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',3,1,'2025-10-01 16:11:55','2025-10-01 16:11:55');
/*!40000 ALTER TABLE `about_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_values`
--

DROP TABLE IF EXISTS `about_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `icon` varchar(100) DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_values`
--

LOCK TABLES `about_values` WRITE;
/*!40000 ALTER TABLE `about_values` DISABLE KEYS */;
INSERT INTO `about_values` VALUES (1,'Authentic Experiences','We believe in genuine connections and authentic cultural exchanges that go beyond typical tourist experiences.','fas fa-heart',1,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(2,'Responsible Tourism','Every trip is designed to benefit local communities and minimize environmental impact while maximizing positive change.','fas fa-leaf',2,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(3,'Community Focus','We work closely with local communities to ensure our tours provide meaningful economic benefits and cultural exchange.','fas fa-users',3,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(4,'Excellence','We\'re committed to delivering exceptional service and unforgettable experiences that exceed expectations.','fas fa-star',4,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(5,'Safety First','Your safety and security are our top priorities. We maintain the highest safety standards in all our operations.','fas fa-shield-alt',5,1,'2025-10-01 16:24:05','2025-10-01 16:24:05'),(6,'Trust & Transparency','We believe in honest communication, fair pricing, and transparent business practices in all our dealings.','fas fa-handshake',6,1,'2025-10-01 16:24:05','2025-10-01 16:24:05');
/*!40000 ALTER TABLE `about_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `participants` int NOT NULL DEFAULT '1',
  `total_cost` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  `special_requests` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,'akash','nirjhorakash07@gmail.com','+880 01616-578097','2025-10-16',2,177776.00,'Pending',NULL,'2025-10-01 11:11:15'),(2,1,'akash','nirjhorakash07@gmail.com','+880 01616-578097','2025-10-16',2,177776.00,'Pending',NULL,'2025-10-01 11:11:18'),(3,8,'akash','nirjhorakash07@gmail.com','+880 01616-578097','2025-10-16',1,4000.00,'Pending',NULL,'2025-10-01 15:47:09'),(4,1,'akash','nirjhorakash07@gmail.com','01984321642','2025-10-10',1,88888.00,'Pending',NULL,'2025-10-01 15:57:40'),(5,1,'akash','nirjhorakash07@gmail.com','+880 01616-578097','2025-10-16',1,88888.00,'Pending',NULL,'2025-10-01 16:01:43'),(6,6,'nirjhor akash','nirjhorakash07@gmail.com','01616578097','2025-10-09',1,2099.00,'Pending','wqwef','2025-10-01 16:07:30'),(7,6,'akash','nirjhorakash07@gmail.com','+880 01616-578097',NULL,1,2099.00,'Pending','guest','2025-10-01 16:07:44'),(8,1,'akash','nirjhorakash07@gmail.com','+880 01616-578097','2025-10-16',5,444440.00,'Pending','asif er khushi tour e jaibo eilaigga jabi ','2025-10-02 10:14:24');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'ADVENTURE','Thrilling adventures for adrenaline seekers','2025-10-01 07:20:30'),(2,'CULTURAL','Immersive cultural experiences and heritage tours','2025-10-01 07:20:30'),(3,'WILDLIFE','Wildlife safaris and nature encounters','2025-10-01 07:20:30'),(4,'NATURE','Natural wonders and eco-tourism','2025-10-01 07:20:30'),(5,'CLASSIC','Classic destinations and timeless experiences','2025-10-01 07:20:30');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_inquiries`
--

DROP TABLE IF EXISTS `contact_inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('New','Read','Replied') DEFAULT 'New',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_inquiries`
--

LOCK TABLES `contact_inquiries` WRITE;
/*!40000 ALTER TABLE `contact_inquiries` DISABLE KEYS */;
INSERT INTO `contact_inquiries` VALUES (1,'akash','nirjhorakash07@gmail.com','','Other','test','New','2025-10-01 10:44:44'),(2,'akash','nirjhorakash07@gmail.com','','Other','test','New','2025-10-01 10:44:46'),(3,'nirjhor akash','nirjhorakash07@gmail.com','01616578097','General Information','WIEUFHu8wefHQEFq','New','2025-10-02 10:15:35'),(4,'Ade','fQEDq@gmail.com','01616578097','Tour Booking','aw4rq24f','New','2025-10-27 13:48:46'),(5,'qmw dj','23@gmail.com','jenfjiqe','Custom Trip Planning','qjienfi2jnf','New','2025-10-28 19:35:09');
/*!40000 ALTER TABLE `contact_inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `description` text NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `highlights` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'Himalayan Adventure','Nepal','15 days',7000.00,'/uploads/tour-1761677256598-559530327.jpeg',1,'Experience the breathtaking beauty of the Himalayas with our expert guides.ethserhaewhgaw4','Kathmandu to Everest Base Camp','Everest Base Camp,Sherpa Culture,Mountain Views,Ancient Monasteries,zdsrgawr','Active',1,'2025-10-01 07:20:30'),(3,'Mystical India Journey','India','14 days',1699.00,'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',2,'Discover the rich heritage and diverse culture of incredible India.','Delhi to Mumbai','Taj Mahal,Rajasthan Palaces,Spiritual Sites,Local Cuisine','Active',1,'2025-10-01 07:20:30'),(4,'European Grand Tour','Europe','21 days',3299.00,'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',5,'Explore the historic cities and cultural treasures of Europe.','London to Rome','Historic Cities,Art Museums,Local Cuisine,Architecture','Active',0,'2025-10-01 07:20:30'),(5,'Amazon Rainforest Expedition','Brazil','10 days',2199.00,'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',4,'Dive deep into the world\'s largest rainforest ecosystem.','Manaus to Iquitos','Wildlife Spotting,River Cruises,Indigenous Culture,Biodiversity','Active',0,'2025-10-01 07:20:30'),(6,'Southeast Asian Discovery','Thailand & Vietnam','18 days',2099.00,'/uploads/tour-1761677361800-660781127.webp',2,'Experience the vibrant cultures and stunning landscapes of Southeast Asia.','Bangkok to Ho Chi Minh City','Ancient Temples,Street Food,Floating Markets,Beach Relaxation','Active',0,'2025-10-01 07:20:30'),(8,'Kashmir','Kashmir','12 days',9000.00,'/uploads/tour-1761677458335-548484762.webp',4,'Kashmir is well known for its beautiful gardens, historical monuments, rivers, enchanting landscapes, picturesque spots, lakes, green forests, waterfalls & docile and gentle people.',NULL,'Beauty of Nature,Some believe it is the heaven on earth!','Active',0,'2025-10-01 15:45:59'),(9,'Kuakata ,Bangladesh','Bangladesh','5',500.00,'/uploads/tour-1761677136174-994895337.jpg',4,'Where the sea meets the river.',NULL,'','Active',0,'2025-10-02 08:11:04');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `website_settings`
--

DROP TABLE IF EXISTS `website_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `website_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `setting_type` enum('text','textarea','url','image','email','phone','json') DEFAULT 'text',
  `category` varchar(50) DEFAULT 'general',
  `display_name` varchar(255) DEFAULT NULL,
  `description` text,
  `is_editable` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website_settings`
--

LOCK TABLES `website_settings` WRITE;
/*!40000 ALTER TABLE `website_settings` DISABLE KEYS */;
INSERT INTO `website_settings` VALUES (1,'site_name','','text','identity','Site Name','Main website name',1,0,'2025-10-01 08:08:53','2025-10-01 08:27:22'),(2,'site_tagline','','text','identity','Site Tagline','Website tagline/slogan',1,0,'2025-10-01 08:08:53','2025-10-01 08:27:22'),(3,'site_logo','/uploads/logos/logo-1759402657626-325141109.jpg','image','identity','Site Logo','Main website logo',1,0,'2025-10-01 08:08:53','2025-10-02 10:57:37'),(4,'site_favicon','','image','identity','Site Favicon','Website favicon',1,0,'2025-10-01 08:08:53','2025-10-01 08:27:22'),(5,'contact_email','soultripst@gmail.com','email','contact','Contact Email','Main contact email address',1,0,'2025-10-01 08:08:53','2025-10-01 11:06:13'),(6,'contact_phone','+880 1616-578097','phone','contact','Contact Phone','Main contact phone number',1,0,'2025-10-01 08:08:54','2025-10-27 13:45:02'),(7,'contact_address','Green City Regency, 26-27 kakrail, Level-11, Dhaka-1000','textarea','contact','Contact Address','Physical business address',1,0,'2025-10-01 08:08:54','2025-10-01 11:01:45'),(8,'social_facebook','','url','social','Facebook URL','Facebook page URL',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(9,'social_instagram','','url','social','Instagram URL','Instagram profile URL',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(10,'social_twitter','','url','social','Twitter URL','Twitter profile URL',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(11,'social_youtube','','url','social','YouTube URL','YouTube channel URL',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(12,'hero_title','Travel Your','text','homepage','Hero Title','Main hero section title',1,0,'2025-10-01 08:08:54','2025-10-01 10:41:43'),(13,'hero_subtitle','Experience the world with small group adventures.','textarea','homepage','Hero Subtitle','Hero section subtitle/description',1,0,'2025-10-01 08:08:54','2025-10-01 10:38:36'),(14,'hero_background','','image','homepage','Hero Background','Hero section background image',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(15,'about_title','','text','about','About Section Title','About section main title',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(16,'about_description','','textarea','about','About Description','About section description',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(17,'footer_description','','textarea','footer','Footer Description','Footer description text',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(18,'footer_copyright','','text','footer','Copyright Text','Footer copyright text',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(19,'meta_description','','textarea','seo','Meta Description','Default meta description for SEO',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(20,'meta_keywords','','textarea','seo','Meta Keywords','Default meta keywords for SEO',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(21,'business_hours','Saturday-Thursday: 9:00 AM - 6:00 PM, Friday: Closed','text','business','Business Hours','Weekly business hours',1,0,'2025-10-01 08:08:54','2025-10-01 15:50:32'),(22,'emergency_contact','','phone','business','Emergency Contact','24/7 emergency contact number',1,0,'2025-10-01 08:08:54','2025-10-01 08:27:22'),(23,'notification_email','admin@soultriptours.com','email','system','Notification Email','Email for system notifications',1,0,'2025-10-01 08:08:54','2025-10-01 08:08:54'),(24,'booking_confirmation_subject','Booking Confirmation - Soul Trip Tours','text','system','Booking Email Subject','Subject for booking confirmation emails',1,0,'2025-10-01 08:08:54','2025-10-01 08:08:54'),(25,'hero_title_highlight','Heart Out','text','homepage','Hero Title Highlight','The highlighted part of the hero title',1,0,'2025-10-01 10:41:43','2025-10-01 10:41:43');
/*!40000 ALTER TABLE `website_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29 11:29:48
