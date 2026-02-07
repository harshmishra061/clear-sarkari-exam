# Clear Sarkari Exam

A comprehensive platform for government job notifications, results, and admit cards in India. Built with Next.js 16, React 19, TypeScript, and MongoDB.

## Features

- 📋 **Latest Job Notifications** - Real-time updates on government job openings
- 📑 **Paginated Job Listing** - Browse all jobs with easy pagination controls
- 📊 **Results & Admit Cards** - Quick access to exam results and admit cards
- 🔍 **SEO Optimized** - Fully optimized for search engines
- ⚡ **Fast Performance** - ISR (Incremental Static Regeneration) for optimal speed
- 📱 **PWA Ready** - Progressive Web App support
- 🎨 **Modern UI** - Clean and responsive design
- 🔐 **Admin Panel** - Secure admin dashboard for content management

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **SEO:** Dynamic sitemap, robots.txt, structured data (JSON-LD)

## Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clear-sarkari-exam
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Create an admin user:
```bash
npm run create-admin
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
clear-sarkari-exam/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin panel routes
│   │   ├── api/               # API routes
│   │   ├── jobs/              # Job detail pages
│   │   ├── latest-jobs/       # Paginated jobs listing page
│   │   ├── layout.tsx         # Root layout with SEO metadata
│   │   ├── page.tsx           # Homepage
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── opengraph-image.tsx # OG image generator
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   │   ├── data/             # Data fetching functions
│   │   ├── seo/              # SEO utilities
│   │   └── mongoose.ts       # Database connection
│   ├── models/               # MongoDB models
│   └── types/                # TypeScript types
├── public/                    # Static files
│   ├── robots.txt            # Search engine crawling rules
│   ├── manifest.json         # PWA manifest
│   └── browserconfig.xml     # Windows tile configuration
└── scripts/                   # Utility scripts
```

## SEO Features

✅ **Comprehensive SEO Implementation:**
- Dynamic XML sitemap (`/sitemap.xml`)
- Robots.txt configuration
- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD) for JobPosting, Organization, WebSite
- Canonical URLs
- PWA manifest
- Dynamic OG image generation
- 404 page optimization

See [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) for detailed SEO setup instructions.

## User Pages

### Latest Jobs (`/latest-jobs`)
- Browse all government job notifications in a paginated view
- 20 jobs per page with easy navigation
- Shows job details including organization, vacancy count, and important dates
- Smooth pagination with page numbers and Previous/Next controls
- Real-time loading states and error handling

## Admin Panel

Access the admin panel at `/admin/login` with your admin credentials.

Features:
- Create, edit, and delete job postings
- Manage job status (active/expired)
- Change admin password
- SEO metadata management per job

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run create-admin # Create new admin user
npm run reset-password # Reset admin password
```

## API Routes

### Public Routes
- `GET /api/latest-jobs` - Get paginated list of jobs
  - Query Parameters:
    - `page` (optional, default: 1) - Page number
    - `limit` (optional, default: 10, max: 100) - Items per page
    - `status` (optional, default: "active") - Filter by status ("active", "expired", or "all")
  - Returns: Paginated job list with metadata

### Admin Routes
- `POST /api/admin/jobs` - Create new job
- `GET /api/admin/jobs` - Get all jobs
- `PUT /api/admin/jobs/[id]` - Update job
- `DELETE /api/admin/jobs/[id]` - Delete job
- `POST /api/admin/change-password` - Change admin password

### Utility Routes
- `POST /api/revalidate` - Trigger ISR revalidation

## Database Models

### LatestJob
- Job title, slug, organization
- Description and SEO metadata
- Important dates and application fees
- Age limits and vacancy details
- Post-wise qualifications
- Important links

### Admin
- Email and hashed password
- Role-based access control

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXT_PUBLIC_BASE_URL` | Public base URL for SEO | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For support, email support@clearsarkariexam.com or create an issue in the repository.
