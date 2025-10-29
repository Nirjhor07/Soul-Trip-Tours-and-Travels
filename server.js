require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const TourService = require('./services/TourService');
const SettingsService = require('./services/SettingsService');
const AboutService = require('./services/AboutService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const tourService = new TourService();
const settingsService = new SettingsService();
const aboutService = new AboutService(tourService.pool);

// Get database connection from tour service
const getDB = () => tourService.pool;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 for admin operations
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  }
});

// More generous rate limiting for admin settings updates
const adminSettingsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute for settings updates
  message: {
    error: 'Too many settings updates, please slow down.',
    retryAfter: 60 // 1 minute in seconds
  }
});

// Configure multer for file uploads
const tourStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'tour-' + uniqueSuffix + fileExtension);
  }
});

const teamStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads', 'team');
    // Create team uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'team-' + uniqueSuffix + fileExtension);
  }
});

const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads', 'logos');
    // Create logo uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + fileExtension);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

const uploadTour = multer({ 
  storage: tourStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadTeam = multer({ 
  storage: teamStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadLogo = multer({ 
  storage: logoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next(); // User is authenticated
  } else {
    return res.redirect('/admin/login?error=unauthorized'); // Redirect to login
  }
};

// Admin credentials (in production, use environment variables or database)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper function to get settings for templates (flattened structure)
const getTemplateSettings = async () => {
    const nestedSettings = await settingsService.getTemplateSettings();
    
    // Flatten the nested structure to match template expectations
    return {
        // Site settings
        site_name: nestedSettings.site.name,
        site_tagline: nestedSettings.site.tagline,
        site_logo: nestedSettings.site.logo,
        site_favicon: nestedSettings.site.favicon,
        
        // Contact settings
        contact_email: nestedSettings.contact.email,
        contact_phone: nestedSettings.contact.phone,
        contact_address: nestedSettings.contact.address,
        
        // Social settings
        social_facebook: nestedSettings.social.facebook,
        social_instagram: nestedSettings.social.instagram,
        social_twitter: nestedSettings.social.twitter,
        social_youtube: nestedSettings.social.youtube,
        
        // Hero settings
        hero_title: nestedSettings.hero.title,
        hero_subtitle: nestedSettings.hero.subtitle,
        hero_title_highlight: nestedSettings.hero.title_highlight,
        hero_background_image: nestedSettings.hero.background,
        
        // About settings
        about_title: nestedSettings.about.title,
        about_description: nestedSettings.about.description,
        
        // Footer settings
        footer_description: nestedSettings.footer.description,
        footer_copyright: nestedSettings.footer.copyright,
        
        // SEO settings
        seo_title: nestedSettings.site.name + ' - ' + nestedSettings.site.tagline,
        seo_description: nestedSettings.seo.description,
        meta_keywords: nestedSettings.seo.keywords,
        
        // Business settings
        business_hours: nestedSettings.business.hours,
        emergency_contact: nestedSettings.business.emergency,
        
        // Notification settings
        notification_email: nestedSettings.notifications.email,
        booking_confirmation_subject: nestedSettings.notifications.booking_subject
    };
};

// Middleware to inject settings into all views
app.use(async (req, res, next) => {
    try {
        res.locals.settings = await getTemplateSettings();
        next();
    } catch (error) {
        console.error('Error loading settings:', error);
        res.locals.settings = {};
        next();
    }
});

// Routes
app.get('/', async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.render('index', { tours: tours.slice(0, 6) });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.render('error');
  }
});

app.get('/tours', async (req, res) => {
  try {
    const category = req.query.category;
    const tours = category 
      ? await tourService.getToursByCategory(category)
      : await tourService.getAllTours();
    res.render('tours', { tours, currentCategory: category });
  } catch (error) {
    console.error('Error loading tours:', error);
    res.render('error');
  }
});

app.get('/tour/:id', async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) {
      return res.status(404).render('404');
    }
    res.render('tour-details', { tour });
  } catch (error) {
    console.error('Error loading tour details:', error);
    res.render('error');
  }
});

app.get('/about', async (req, res) => {
  try {
    const aboutData = await aboutService.getAboutContent();
    res.render('about', { aboutData });
  } catch (error) {
    console.error('Error loading about page:', error);
    res.render('about', { aboutData: { content: [], team: [], stats: [] } });
  }
});

app.get('/contact', (req, res) => {
  const success = req.query.success === 'true';
  const error = req.query.error === 'true';
  res.render('contact', { success, error });
});

// Image upload endpoint
app.post('/api/upload-image', uploadTour.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }
    
    // Return the relative path to the uploaded image
    const imagePath = `/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      imagePath: imagePath,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image' 
    });
  }
});

// Admin routes
app.get('/admin/login', (req, res) => {
  // If already logged in, redirect to dashboard
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  
  // Get error message from query params if any
  const error = req.query.error;
  res.render('admin-login', { error });
});

// Admin login POST route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Set session
    req.session.isAdmin = true;
    req.session.username = username;
    
    // Redirect to dashboard
    res.redirect('/admin/dashboard');
  } else {
    // Invalid credentials
    res.redirect('/admin/login?error=invalid');
  }
});

// Admin logout POST route
app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/admin/login');
  });
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
  res.render('admin-dashboard');
});

// API Routes for Admin Dashboard
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    const bookingsQuery = 'SELECT COUNT(*) as count FROM bookings';
    const inquiriesQuery = 'SELECT COUNT(*) as count FROM contact_inquiries';
    
    const [bookingResult] = await getDB().execute(bookingsQuery);
    const [inquiryResult] = await getDB().execute(inquiriesQuery);
    
    res.json({
      tours: tours.length,
      bookings: bookingResult[0].count,
      inquiries: inquiryResult[0].count
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/tours', requireAuth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const tours = await tourService.getAllTours();
    const result = limit ? tours.slice(0, limit) : tours;
    res.json(result);
  } catch (error) {
    console.error('Error fetching tours for admin:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Tours Management Routes
app.get('/admin/tours', requireAuth, async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.render('admin-tours', { tours });
  } catch (error) {
    console.error('Error loading tours page:', error);
    res.render('admin-tours', { tours: [] });
  }
});

app.get('/admin/tours/add', requireAuth, (req, res) => {
  res.render('admin-tour-form', { tour: null, action: 'add' });
});

app.get('/admin/tours/edit/:id', requireAuth, async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) {
      return res.status(404).send('Tour not found');
    }
    res.render('admin-tour-form', { tour, action: 'edit' });
  } catch (error) {
    console.error('Error loading tour for editing:', error);
    res.status(500).send('Error loading tour');
  }
});

app.post('/api/admin/tours', requireAuth, async (req, res) => {
  try {
    const { title, description, price, duration, destination, category_id, highlights, image } = req.body;
    
    // Convert highlights array to comma-separated string
    const highlightsString = Array.isArray(highlights) ? highlights.join(',') : highlights;
    
    // Insert new tour with highlights
    const insertTourQuery = `
      INSERT INTO tours (title, description, price, duration, destination, category_id, image, highlights, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await getDB().execute(insertTourQuery, [
      title, description, parseFloat(price), duration, destination, category_id, image, highlightsString
    ]);
    
    const tourId = result.insertId;
    
    res.json({ success: true, message: 'Tour added successfully', tourId });
  } catch (error) {
    console.error('Error adding tour:', error);
    res.status(500).json({ success: false, error: 'Failed to add tour' });
  }
});

app.put('/api/admin/tours/:id', requireAuth, async (req, res) => {
  try {
    const tourId = req.params.id;
    const { title, description, price, duration, destination, category_id, highlights, image } = req.body;
    
    // Convert highlights array to comma-separated string
    const highlightsString = Array.isArray(highlights) ? highlights.join(',') : highlights;
    
    // Update tour with highlights included
    const updateTourQuery = `
      UPDATE tours 
      SET title = ?, description = ?, price = ?, duration = ?, destination = ?, category_id = ?, image = ?, highlights = ?
      WHERE id = ?
    `;
    
    await getDB().execute(updateTourQuery, [
      title, description, parseFloat(price), duration, destination, category_id, image, highlightsString, tourId
    ]);
    
    res.json({ success: true, message: 'Tour updated successfully' });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ success: false, error: 'Failed to update tour' });
  }
});

app.delete('/api/admin/tours/:id', requireAuth, async (req, res) => {
  try {
    const tourId = req.params.id;
    console.log(`🗑️  Delete tour request received for ID: ${tourId}`);
    
    // Check if there are any bookings for this tour
    console.log('📋 Checking for existing bookings...');
    const [bookings] = await getDB().execute('SELECT COUNT(*) as count FROM bookings WHERE tour_id = ?', [tourId]);
    console.log(`📊 Found ${bookings[0].count} bookings for tour ${tourId}`);
    
    if (bookings[0].count > 0) {
      console.log(`❌ Cannot delete tour ${tourId} - has ${bookings[0].count} bookings`);
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete tour. There are ${bookings[0].count} booking(s) associated with this tour.`,
        hasBookings: true
      });
    }
    
    // Delete related data first (in correct order to respect foreign key constraints)
    console.log('🧹 Cleaning up related data...');
    await getDB().execute('DELETE FROM tour_highlights WHERE tour_id = ?', [tourId]);
    await getDB().execute('DELETE FROM tour_gallery WHERE tour_id = ?', [tourId]);
    await getDB().execute('DELETE FROM tour_itinerary WHERE tour_id = ?', [tourId]);
    await getDB().execute('DELETE FROM tour_pricing WHERE tour_id = ?', [tourId]);
    
    // Finally delete the tour
    console.log(`🎯 Deleting tour ${tourId}...`);
    const [result] = await getDB().execute('DELETE FROM tours WHERE id = ?', [tourId]);
    console.log(`📈 Deletion result: ${JSON.stringify(result)}`);
    
    if (result.affectedRows === 0) {
      console.log(`❌ Tour ${tourId} not found`);
      return res.status(404).json({ success: false, error: 'Tour not found' });
    }
    
    console.log(`✅ Tour ${tourId} deleted successfully`);
    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting tour:', error);
    
    // Handle specific MySQL errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ 
        success: false, 
        error: 'Cannot delete tour. It has associated bookings or other dependencies.' 
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to delete tour' });
    }
  }
});

// Bookings Management Routes
app.get('/admin/bookings', requireAuth, async (req, res) => {
  try {
    const bookingsQuery = `
      SELECT b.*, 
             b.customer_name as name,
             b.customer_email as email,
             b.customer_phone as phone,
             b.preferred_date as travel_date,
             b.total_cost as total_amount,
             t.title as tour_title 
      FROM bookings b 
      LEFT JOIN tours t ON b.tour_id = t.id 
      ORDER BY b.created_at DESC
    `;
    const [bookings] = await getDB().execute(bookingsQuery);
    res.render('admin-bookings', { bookings });
  } catch (error) {
    console.error('Error loading bookings:', error);
    res.render('admin-bookings', { bookings: [] });
  }
});

app.delete('/api/admin/bookings/:id', requireAuth, async (req, res) => {
  try {
    await getDB().execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, error: 'Failed to delete booking' });
  }
});

// Get single booking
app.get('/api/admin/bookings/:id', requireAuth, async (req, res) => {
  try {
    const bookingQuery = `
      SELECT b.*, 
             b.customer_name as name,
             b.customer_email as email,
             b.customer_phone as phone,
             b.preferred_date as travel_date,
             b.total_cost as total_amount,
             t.title as tour_title 
      FROM bookings b 
      LEFT JOIN tours t ON b.tour_id = t.id 
      WHERE b.id = ?
    `;
    const [rows] = await getDB().execute(bookingQuery, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking
app.put('/api/admin/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      travel_date, 
      participants, 
      total_amount, 
      status,
      special_requests 
    } = req.body;
    
    const updateQuery = `
      UPDATE bookings 
      SET customer_name = ?, 
          customer_email = ?, 
          customer_phone = ?, 
          preferred_date = ?, 
          participants = ?, 
          total_cost = ?, 
          status = ?,
          special_requests = ?
      WHERE id = ?
    `;
    
    await getDB().execute(updateQuery, [
      name,
      email,
      phone,
      travel_date,
      participants,
      total_amount,
      status,
      special_requests,
      req.params.id
    ]);
    
    res.json({ success: true, message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

// Contact Inquiries Management Routes
app.get('/admin/contacts', requireAuth, async (req, res) => {
  try {
    const contactsQuery = 'SELECT * FROM contact_inquiries ORDER BY created_at DESC';
    const [contacts] = await getDB().execute(contactsQuery);
    res.render('admin-contacts', { contacts });
  } catch (error) {
    console.error('Error loading contacts:', error);
    res.render('admin-contacts', { contacts: [] });
  }
});

app.delete('/api/admin/contacts/:id', requireAuth, async (req, res) => {
  try {
    await getDB().execute('DELETE FROM contact_inquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Contact inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to delete contact inquiry' });
  }
});

app.put('/api/admin/contacts/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const contactId = req.params.id;
    
    // Validate status
    if (!['New', 'Read', 'Replied', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }
    
    await getDB().execute(
      'UPDATE contact_inquiries SET status = ?, updated_at = NOW() WHERE id = ?', 
      [status, contactId]
    );
    
    res.json({ success: true, message: 'Contact status updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, error: 'Failed to update contact status' });
  }
});

// Settings Management Route
app.get('/admin/settings', requireAuth, async (req, res) => {
    try {
        console.log('Fetching settings...');
        const settings = await settingsService.getAllSettings();
        console.log('Settings fetched:', settings.length, 'items');
        
        const categories = ['identity', 'contact', 'social', 'homepage', 'about', 'footer', 'seo', 'business'];
        res.render('admin-settings', { 
            title: 'Website Settings',
            settings,
            categories
        });
    } catch (error) {
        console.error('Error loading settings:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to load settings: ' + error.message
        });
    }
});

app.post('/admin/settings/update', requireAuth, adminSettingsLimiter, async (req, res) => {
    try {
        console.log('📥 Settings update request received');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('Raw body type:', typeof req.body);
        
        const { setting_key, value } = req.body;
        
        console.log('📋 Extracted:', { setting_key, value });
        
        if (!setting_key || value === undefined) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false, 
                error: 'Setting key and value are required' 
            });
        }

        const updated = await settingsService.updateSetting(setting_key, value);
        console.log('✅ Database update result:', updated);
        
        if (updated) {
            res.json({ 
                success: true, 
                message: 'Setting updated successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Setting not found' 
            });
        }
    } catch (error) {
        console.error('❌ Error updating setting:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update setting: ' + error.message 
        });
    }
});

app.get('/admin/settings/category/:category', requireAuth, async (req, res) => {
    try {
        const { category } = req.params;
        const settings = await settingsService.getSettingsByCategory(category);
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error loading category settings:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load category settings' 
        });
    }
});

// Logo upload route
app.post('/admin/settings/upload-logo', requireAuth, adminSettingsLimiter, uploadLogo.single('logo'), async (req, res) => {
    try {
        console.log('📤 Logo upload request received');
        console.log('File:', req.file);
        console.log('Body:', req.body);
        
        if (!req.file) {
            console.log('❌ No file uploaded');
            return res.status(400).json({ success: false, message: 'No logo file uploaded' });
        }

        // Generate the logo path
        const logoPath = `/uploads/logos/${req.file.filename}`;
        console.log('📁 Generated logo path:', logoPath);
        
        // Update the site_logo setting in the database
        await settingsService.updateSetting('site_logo', logoPath);
        console.log('✅ Database updated successfully');
        
        res.json({ 
            success: true, 
            message: 'Logo uploaded successfully',
            logoPath: logoPath
        });
    } catch (error) {
        console.error('❌ Error uploading logo:', error);
        res.status(500).json({ success: false, message: 'Failed to upload logo: ' + error.message });
    }
});

// About Content Management Routes
app.get('/admin/about', requireAuth, async (req, res) => {
  try {
    const aboutData = await aboutService.getAboutContent();
    res.render('admin-about', { aboutData });
  } catch (error) {
    console.error('Error loading about admin page:', error);
    res.render('admin-about', { aboutData: { content: [], team: [], stats: [], values: [] } });
  }
});

// Update about content section
app.post('/admin/about/content/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.updateContent(id, req.body);
    
    if (result) {
      res.json({ success: true, message: 'Content updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Content not found' });
    }
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// Add new about content section
app.post('/admin/about/content', requireAuth, async (req, res) => {
  try {
    const id = await aboutService.addContent(req.body);
    res.json({ success: true, message: 'Content added successfully', id });
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({ success: false, message: 'Failed to add content' });
  }
});

// Delete about content section
app.delete('/admin/about/content/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.deleteContent(id);
    
    if (result) {
      res.json({ success: true, message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Content not found' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ success: false, message: 'Failed to delete content' });
  }
});

// Team member management
app.post('/admin/about/team/:id', requireAuth, uploadTeam.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prepare update data
    const updateData = req.body;
    
    // If an image was uploaded, add it to the update data
    if (req.file) {
      updateData.image = `/uploads/team/${req.file.filename}`;
    }
    
    const result = await aboutService.updateTeamMember(id, updateData);
    
    if (result) {
      res.json({ success: true, message: 'Team member updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Team member not found' });
    }
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ success: false, message: 'Failed to update team member' });
  }
});

app.post('/admin/about/team', requireAuth, uploadTeam.single('image'), async (req, res) => {
  try {
    // Prepare team member data
    const teamData = req.body;
    
    // If an image was uploaded, add it to the team data
    if (req.file) {
      teamData.image = `/uploads/team/${req.file.filename}`;
    }
    
    const id = await aboutService.addTeamMember(teamData);
    res.json({ success: true, message: 'Team member added successfully', id });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ success: false, message: 'Failed to add team member' });
  }
});

app.delete('/admin/about/team/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.deleteTeamMember(id);
    
    if (result) {
      res.json({ success: true, message: 'Team member deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Team member not found' });
    }
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team member' });
  }
});

// Statistics management
app.post('/admin/about/stats/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.updateStat(id, req.body);
    
    if (result) {
      res.json({ success: true, message: 'Statistic updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Statistic not found' });
    }
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).json({ success: false, message: 'Failed to update statistic' });
  }
});

app.post('/admin/about/stats', requireAuth, async (req, res) => {
  try {
    const id = await aboutService.addStat(req.body);
    res.json({ success: true, message: 'Statistic added successfully', id });
  } catch (error) {
    console.error('Error adding statistic:', error);
    res.status(500).json({ success: false, message: 'Failed to add statistic' });
  }
});

app.delete('/admin/about/stats/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.deleteStat(id);
    
    if (result) {
      res.json({ success: true, message: 'Statistic deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Statistic not found' });
    }
  } catch (error) {
    console.error('Error deleting statistic:', error);
    res.status(500).json({ success: false, message: 'Failed to delete statistic' });
  }
});

// Values management
app.post('/admin/about/values/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.updateValue(id, req.body);
    
    if (result) {
      res.json({ success: true, message: 'Value updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Value not found' });
    }
  } catch (error) {
    console.error('Error updating value:', error);
    res.status(500).json({ success: false, message: 'Failed to update value' });
  }
});

app.post('/admin/about/values', requireAuth, async (req, res) => {
  try {
    const id = await aboutService.addValue(req.body);
    res.json({ success: true, message: 'Value added successfully', id });
  } catch (error) {
    console.error('Error adding value:', error);
    res.status(500).json({ success: false, message: 'Failed to add value' });
  }
});

app.delete('/admin/about/values/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aboutService.deleteValue(id);
    
    if (result) {
      res.json({ success: true, message: 'Value deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Value not found' });
    }
  } catch (error) {
    console.error('Error deleting value:', error);
    res.status(500).json({ success: false, message: 'Failed to delete value' });
  }
});

// Analytics Route
app.get('/admin/analytics', requireAuth, async (req, res) => {
  try {
    // Get analytics data
    const toursQuery = 'SELECT COUNT(*) as count FROM tours';
    const bookingsQuery = 'SELECT COUNT(*) as count FROM bookings';
    const contactsQuery = 'SELECT COUNT(*) as count FROM contact_inquiries';
    const monthlyBookingsQuery = `
      SELECT MONTH(created_at) as month, COUNT(*) as count 
      FROM bookings 
      WHERE YEAR(created_at) = YEAR(CURDATE()) 
      GROUP BY MONTH(created_at)
      ORDER BY month
    `;
    
    const [tours] = await getDB().execute(toursQuery);
    const [bookings] = await getDB().execute(bookingsQuery);
    const [contacts] = await getDB().execute(contactsQuery);
    const [monthlyBookings] = await getDB().execute(monthlyBookingsQuery);
    
    const analytics = {
      totalTours: tours[0].count,
      totalBookings: bookings[0].count,
      totalContacts: contacts[0].count,
      monthlyBookings
    };
    
    res.render('admin-analytics', { analytics });
  } catch (error) {
    console.error('Error loading analytics:', error);
    res.render('admin-analytics', { analytics: null });
  }
});

// Contact form submission
app.post('/contact', async (req, res) => {
  console.log('📝 Contact form submitted!');
  console.log('Form data:', req.body);
  
  const { name, email, phone, message, subject } = req.body;
  
  // Validate required fields
  if (!name || !email || !message) {
    console.log('❌ Missing required fields');
    return res.redirect('/contact?error=true');
  }
  
  try {
    console.log('💾 Saving contact inquiry to database...');
    
    // Save to database
    await tourService.addContactInquiry({
      name, email, phone, subject, message
    });
    
    console.log('✅ Contact inquiry saved to database');
    console.log('📧 Preparing emails...');
    
    // Email to you (website owner)
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'} - Soul Trip Tours`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0369a1); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Soul Trip Tours & Travels</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">Contact Details</h2>
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong style="color: #475569;">Name:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong style="color: #475569;">Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong style="color: #475569;">Phone:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong style="color: #475569;">Subject:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${subject || 'General Inquiry'}</td>
                </tr>
              </table>
              <div style="margin-top: 20px;">
                <strong style="color: #475569; font-size: 16px;">Message:</strong>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #0ea5e9;">
                  <p style="margin: 0; color: #1e293b; line-height: 1.6; font-size: 15px;">${message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    // Auto-reply to the customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Soul Trip Tours & Travels',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #0369a1); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Soul Trip Tours & Travels</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0;">Thank you for reaching out!</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #1e293b;">Hello ${name}! 👋</h2>
            <p style="color: #475569; line-height: 1.7;">
              Thank you for contacting <strong>Soul Trip Tours & Travels</strong>! We have received your inquiry about 
              "<strong>${subject || 'General Inquiry'}</strong>" and our team will get back to you within <strong>24 hours</strong>.
            </p>
            <p style="color: #475569; line-height: 1.7;">
              We're excited to help you plan your next adventure! 🌍✈️
            </p>
          </div>
        </div>
      `
    };

    // Send both emails
    console.log('📤 Sending owner email...');
    await transporter.sendMail(ownerMailOptions);
    console.log('✅ Owner email sent successfully');
    
    console.log('📤 Sending customer email...');
    await transporter.sendMail(customerMailOptions);
    console.log('✅ Customer email sent successfully');

    console.log('🎉 All emails sent successfully!');
    res.redirect('/contact?success=true');
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Error details:', error);
    res.redirect('/contact?error=true');
  }
});

// Booking form submission
app.post('/book', async (req, res) => {
  const { name, email, phone, tourId, date, participants, specialRequests } = req.body;
  
  try {
    console.log('💾 Saving booking to database...');
    
    // Save to database
    await tourService.addBooking({
      tourId, 
      name, 
      email, 
      phone: phone || null,
      date: date && date.trim() !== '' ? date : null, 
      participants: parseInt(participants) || 1,
      specialRequests: specialRequests || null
    });
    
    console.log('✅ Booking saved to database');
    
    // Get tour details for email
    const tour = await tourService.getTourById(tourId);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Booking Request - ${tour.title}`,
      html: `
        <h3>New Booking Request</h3>
        <p><strong>Tour:</strong> ${tour.title}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date:</strong> ${date}</p>
        <p><strong>Number of Participants:</strong> ${participants}</p>
        <p><strong>Total Estimated Cost:</strong> $${tour.price * participants}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Booking request submitted successfully! We will contact you to confirm details.' });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ success: false, message: 'Sorry, there was an error processing your booking. Please try again.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error');
});

app.listen(PORT, () => {
  console.log(`Soul Trip Tours server is running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: Connected to MySQL`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  await tourService.close();
  console.log('✅ Database connections closed');
  process.exit(0);
});
