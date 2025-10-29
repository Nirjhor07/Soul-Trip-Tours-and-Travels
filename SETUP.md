# Soul Trip Tours - Setup & Deployment Guide

## Quick Start

Your website is already running! Visit **http://localhost:3000** to see it live.

## ✅ What's Already Done

- ✅ All dependencies installed
- ✅ Tailwind CSS compiled
- ✅ Development server running
- ✅ All major errors fixed
- ✅ Email fallback system implemented

## 📧 Email Configuration

The contact forms are working with a fallback system:

### Current Status (Demo Mode)

- Forms will log submissions to the console
- No actual emails will be sent
- Forms still provide user feedback

### To Enable Email Sending

1. Update `.env` file with your email credentials:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

2. For Gmail setup:
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Use the app password (not your regular password)

## 🎨 Customization

### Colors & Branding

Edit `tailwind.config.js` to change colors:

```javascript
colors: {
  primary: {
    // Your brand colors here
  }
}
```

### Content

- **Tours**: Edit tour data in `server.js` (lines 48-91)
- **Company Info**: Update contact details in footer and contact page
- **Images**: Replace Unsplash URLs with your own images

### Adding Tours

Add new tours to the `tours` array in `server.js`:

```javascript
{
  id: 7,
  title: "Your New Tour",
  destination: "Destination",
  duration: "10 days",
  price: 1999,
  image: "your-image.jpg",
  category: "ADVENTURE",
  description: "Tour description...",
  highlights: ["Highlight 1", "Highlight 2"],
  route: "Start to End"
}
```

## 🚀 Development

### Available Scripts

- `npm start` - Production server
- `npm run dev` - Development with auto-reload
- `npm run build:css` - Rebuild Tailwind CSS

### File Structure

```
/
├── public/           # Static files (CSS, JS, images)
├── views/            # EJS templates
├── server.js         # Main server file
├── .env              # Environment variables
├── package.json      # Dependencies
└── tailwind.config.js # Tailwind configuration
```

## 🌐 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure actual email credentials
3. Set secure JWT and session secrets

### Recommended Hosting

- **VPS**: DigitalOcean, Linode, AWS EC2
- **Platform**: Railway, Render, Heroku
- **CDN**: Cloudflare for images

### Production Checklist

- [ ] Update all placeholder credentials
- [ ] Enable HTTPS/SSL
- [ ] Set up domain name
- [ ] Configure email service
- [ ] Add real tour images
- [ ] Test contact forms
- [ ] Set up backups
- [ ] Monitor performance

## 🔧 Troubleshooting

### Common Issues

**Port 3000 in use:**

```bash
# Change port in .env file
PORT=3001
```

**CSS not updating:**

```bash
npm run build:css
```

**Email not working:**

- Check `.env` credentials
- Enable 2FA for Gmail
- Use app-specific password

### Support

- Check server logs for errors
- Contact forms log to console when email is not configured
- All error pages are implemented (404, 500)

## 📱 Features

### Completed Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tour browsing and filtering
- ✅ Individual tour detail pages
- ✅ Contact form with validation
- ✅ Booking system
- ✅ Email notifications (with fallback)
- ✅ SEO optimization
- ✅ Error handling
- ✅ Professional UI/UX

### Optional Enhancements

- User authentication
- Payment integration (Stripe)
- Admin dashboard
- Blog system
- Review system
- Multi-language support

## 🎯 Next Steps

1. **Customize Content**: Update tours, company info, images
2. **Configure Email**: Set up proper email credentials
3. **Deploy**: Choose hosting platform and deploy
4. **Domain**: Set up custom domain
5. **SSL**: Enable HTTPS security
6. **Analytics**: Add Google Analytics
7. **Marketing**: Add social media integration

Your professional travel website is ready to go! 🌍✈️
