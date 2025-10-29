# 🌍 Soul Trip Tours - Travel & Tourism Website

A modern, full-featured travel website built with Node.js, Express, and MySQL. Features a complete admin panel for content management and a beautiful responsive frontend for customers.

![Soul Trip Tours](./logo/soul-trip-logo.png)

## ✨ Features

### 🎯 Frontend (Customer-Facing)
- 🏠 **Modern Homepage** - Beautiful hero section with company branding
- 🗺️ **Tour Listings** - Detailed tour information with images and pricing
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 📧 **Contact Forms** - Email integration with nodemailer
- 👥 **Meet Our Team** - Dynamic team member profiles
- 📊 **Company Stats** - Showcase achievements and experience
- 🎨 **About Page** - Company values and mission

### 🔐 Admin Panel
- 🛡️ **Secure Authentication** - Environment-based credentials
- 📊 **Analytics Dashboard** - Business insights and statistics
- ✏️ **Tour Management** - Full CRUD operations for tours
- 📋 **Booking Management** - Handle customer reservations
- 👥 **Team Management** - Add/edit team members with photo uploads
- 🖼️ **Logo Upload** - Dynamic logo management system
- ⚙️ **Settings Panel** - Site configuration and customization
- 📝 **Content Management** - Update all site content dynamically

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **EJS** - Templating engine
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **Express-session** - Authentication management

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Vanilla JavaScript** - Dynamic interactions
- **Responsive Design** - Mobile-first approach

### Security & Performance
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Data sanitization
- **Session Management** - Secure authentication
- **Environment Variables** - Secure credential storage

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd soul-trip-tours
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

- Email configuration (Gmail SMTP recommended)
- API keys (Google Maps, Stripe, etc.)
- Database credentials (if using a database)

4. Build Tailwind CSS:

```bash
npm run build:css
```

5. Start the development server:

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build:css` - Build and watch Tailwind CSS

## Project Structure

```
soul-trip-tours/
├── public/                 # Static assets
│   ├── css/               # Compiled CSS
│   ├── js/                # Client-side JavaScript
│   └── images/            # Image assets
├── views/                 # EJS templates
│   ├── partials/          # Reusable template parts
│   ├── index.ejs          # Homepage
│   ├── tours.ejs          # Tours listing
│   ├── tour-details.ejs   # Individual tour page
│   ├── about.ejs          # About page
│   ├── contact.ejs        # Contact page
│   ├── 404.ejs            # 404 error page
│   └── error.ejs          # Server error page
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── .env                   # Environment variables
└── README.md             # This file
```

## Configuration

### Email Setup

The website uses Nodemailer for sending contact form and booking emails. Configure your email settings in the `.env` file:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

For Gmail, you'll need to:

1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in the `EMAIL_PASS` field

### Environment Variables

All sensitive configuration is stored in environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `EMAIL_*` - Email configuration
- `DB_*` - Database configuration (if needed)
- `*_API_KEY` - Various API keys
- `JWT_SECRET` - JWT signing secret
- `SESSION_SECRET` - Session secret

## Customization

### Adding New Tours

Tours are currently stored in the `server.js` file as sample data. To add new tours:

1. Add tour data to the `tours` array in `server.js`
2. Include all required fields: title, destination, duration, price, image, category, description, highlights, route
3. Restart the server

For production, consider moving tour data to a database.

### Styling

The website uses Tailwind CSS for styling. Custom styles are defined in:

- `public/css/input.css` - Source CSS with Tailwind directives
- `tailwind.config.js` - Tailwind configuration

To modify the design:

1. Edit the Tailwind configuration or CSS files
2. Run `npm run build:css` to rebuild styles
3. Restart the development server

### Adding New Pages

To add new pages:

1. Create a new EJS template in the `views/` directory
2. Add a route handler in `server.js`
3. Update navigation in `views/partials/header.ejs`

## Deployment

### Production Setup

1. Set `NODE_ENV=production` in your environment
2. Configure your production email settings
3. Set up a reverse proxy (nginx recommended)
4. Use a process manager like PM2
5. Set up SSL certificates

### Recommended Hosting

- **VPS**: DigitalOcean, Linode, or similar
- **Platform**: Railway, Render, or Heroku
- **Static Assets**: Consider using a CDN for images

## Security Considerations

The website includes several security features:

- Rate limiting to prevent abuse
- CORS configuration
- Environment variable protection
- Input validation
- Error handling

For production:

- Use HTTPS
- Implement proper authentication if needed
- Regular security updates
- Monitor for vulnerabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:

- Email: info@soultriptours.com
- Phone: +1 (555) 123-4567

## Acknowledgments

- Design inspired by G Adventures
- Images from Unsplash
- Icons from Font Awesome
- Built with love for travelers everywhere
