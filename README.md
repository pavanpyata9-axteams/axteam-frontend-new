# AX Team - Home & Business Services Website

A modern, responsive React website for AX Team, offering complete home and business services including AC Repair, Wall Painting, Electrical Work, Interior Design, Plumbing & Cleaning, and Home Maintenance.

## 🚀 Features

- **5 Fully Functional Pages**: Home, About, Services, Gallery, and Contact
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with React + TailwindCSS for a clean, professional look
- **Smooth Navigation**: React Router for seamless page transitions
- **Interactive Components**: Service cards, contact forms, and gallery
- **WhatsApp Integration**: Floating button for quick customer contact
- **Back-to-Top Button**: Easy navigation for long pages

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Font**: Poppins (Google Fonts)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
axteam-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation bar with responsive menu
│   │   ├── Footer.jsx      # Site footer with links
│   │   ├── ServiceCard.jsx # Reusable service card component
│   │   └── ContactForm.jsx # Contact form with validation
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with hero, services, testimonials
│   │   ├── About.jsx       # Company information and team
│   │   ├── Services.jsx    # Service listings and details
│   │   ├── Gallery.jsx     # Project gallery with filters
│   │   └── Contact.jsx     # Contact form and information
│   ├── App.jsx             # Main app with routing and floating buttons
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## 🎨 Design Features

- **Color Palette**: White, Blue, and Grey for a trustworthy look
- **Typography**: Poppins font for a modern, clean appearance
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first approach with breakpoints

## 🔗 Pages Overview

### Home Page
- Hero section with call-to-action buttons
- Service overview with 6 main services
- Why Choose Us section
- Customer testimonials
- Final CTA section

### About Page
- Company mission and vision
- Core values
- Team members
- What makes us different
- Contact CTA

### Services Page
- Detailed service cards
- Features for each service
- Why choose our services
- Easy booking integration

### Gallery Page
- Project showcase grid
- Category filtering
- Image enlargement on click
- Visual project presentation

### Contact Page
- Contact form with validation
- Company contact information
- Business hours
- Social media links
- Google Maps placeholder

## 🔮 Future Backend Integration

This frontend is ready for backend integration:

- **API Endpoints**:
  - POST `/api/contact` - Submit contact form
  - GET `/api/services` - Fetch services dynamically
  - GET `/api/gallery` - Fetch gallery images
  - POST `/api/bookings` - Handle service bookings

- **Database**: MongoDB for storing form submissions, services, and gallery items
- **Backend Stack**: Node.js + Express

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### GitHub Pages
Update the `homepage` field in `package.json` and deploy using GitHub Actions.

## 📝 Customization

### Update WhatsApp Number
In `src/App.jsx`, find the WhatsApp button component and update:
```javascript
const phoneNumber = 'YOUR_WHATSAPP_NUMBER';
```

### Update Contact Information
Modify contact details in:
- `src/components/Footer.jsx`
- `src/pages/Contact.jsx`

### Change Colors
Update the primary color in `tailwind.config.js` under the `colors` section.

### Add Real Images
Replace emoji placeholders in gallery with actual images:
```javascript
<img src="/path/to/image.jpg" alt={item.description} />
```

## 📄 License

This project is created for AX Team. All rights reserved.

## 👥 Support

For support, email info@axteam.com or create an issue in the repository.

---

Built with ❤️ using React + Vite + TailwindCSS

