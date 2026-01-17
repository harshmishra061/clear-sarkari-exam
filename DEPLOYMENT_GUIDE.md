# Deployment Guide - Clear Sarkari Exam

## Current Deployment Status

✅ **Live URL:** https://clear-sarkari-exam.vercel.app/

## Environment Variables

### Production (Vercel)

Add these environment variables in your Vercel dashboard:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `clear-sarkari-exam`
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=https://clear-sarkari-exam.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key

# Base URL for SEO
NEXT_PUBLIC_BASE_URL=https://clear-sarkari-exam.vercel.app
```

### Development

For local development, use `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Post-Deployment Checklist

### 1. Verify SEO Files Are Accessible

Test these URLs on your live site:

- ✅ https://clear-sarkari-exam.vercel.app/robots.txt
- ✅ https://clear-sarkari-exam.vercel.app/sitemap.xml
- ✅ https://clear-sarkari-exam.vercel.app/manifest.json
- ✅ https://clear-sarkari-exam.vercel.app/opengraph-image

### 2. Set Up Google Search Console

1. **Sign up:** https://search.google.com/search-console
2. **Add Property:** `https://clear-sarkari-exam.vercel.app`
3. **Verify Ownership:**
   - Choose "HTML tag" method
   - Copy the verification code
   - Add to `src/app/layout.tsx` in the `verification.google` field
   - Redeploy to Vercel
4. **Submit Sitemap:**
   - In Search Console, go to Sitemaps
   - Submit: `https://clear-sarkari-exam.vercel.app/sitemap.xml`

### 3. Test SEO Implementation

#### Rich Results Test
- URL: https://search.google.com/test/rich-results
- Test: `https://clear-sarkari-exam.vercel.app`
- Expected: JobPosting schema detected on job pages

#### Mobile-Friendly Test
- URL: https://search.google.com/test/mobile-friendly
- Test: `https://clear-sarkari-exam.vercel.app`
- Expected: Mobile-friendly

#### PageSpeed Insights
- URL: https://pagespeed.web.dev/
- Test: `https://clear-sarkari-exam.vercel.app`
- Target: Score > 90

#### Open Graph Debugger
- Facebook: https://developers.facebook.com/tools/debug/
- Test: `https://clear-sarkari-exam.vercel.app`
- Expected: OG image and tags detected

### 4. Create Icon Files

Create and add these to the `/public` folder:

1. **icon-192x192.png** (192×192 pixels)
2. **icon-512x512.png** (512×512 pixels)
3. **apple-touch-icon.png** (180×180 pixels)

**Tools:**
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

After creating, commit and push:
```bash
git add public/icon-*.png public/apple-touch-icon.png
git commit -m "Add PWA icons"
git push
```

## Vercel Deployment Configuration

### Build Settings

Current configuration (should be automatic):

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` or `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Environment Variables Required

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | Your MongoDB connection string | Yes |
| `NEXTAUTH_URL` | https://clear-sarkari-exam.vercel.app | Yes |
| `NEXTAUTH_SECRET` | Your secret key | Yes |
| `NEXT_PUBLIC_BASE_URL` | https://clear-sarkari-exam.vercel.app | Yes |

### Deployment Triggers

Vercel will automatically deploy when:
- You push to the `main` branch (production)
- You push to any branch (preview deployment)
- You create a pull request (preview deployment)

## Testing Before Deployment

Always test locally before pushing:

```bash
# Build production bundle
npm run build

# Test production build locally
npm start

# Test key URLs
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/manifest.json
```

## Continuous Monitoring

### Daily
- Check site uptime
- Monitor error logs in Vercel
- Verify job posts are displaying correctly

### Weekly
- Review Google Search Console
  - Index coverage
  - Search performance
  - Mobile usability
- Check Core Web Vitals
- Review Vercel Analytics

### Monthly
- Analyze traffic trends
- Review top search queries
- Optimize low-performing pages
- Update content based on insights

## Rollback Procedure

If something goes wrong:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Via Git:**
   ```bash
   git revert HEAD
   git push
   ```

## Custom Domain Setup (Optional - Future)

If you want to use a custom domain in the future (like `yourdomain.com`):

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   ```env
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Update SEO Files:**
   - Update `robots.txt` with new domain
   - Resubmit sitemap to Google Search Console

4. **Set up Redirects:**
   - Ensure `clear-sarkari-exam.vercel.app` redirects to custom domain
   - Update canonical URLs

## Performance Optimization

### Enable Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics
4. Enable Speed Insights

### Enable Vercel Speed Insights

Add to `src/app/layout.tsx`:

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Enable ISR (Already Configured)

ISR is already set up with `revalidate: 60` on:
- Homepage (`src/app/page.tsx`)
- Job pages (`src/app/jobs/[slug]/page.tsx`)

## Troubleshooting

### Issue: Sitemap not generating
**Solution:**
- Check MongoDB connection
- Verify environment variables are set
- Check Vercel function logs

### Issue: 404 on job pages
**Solution:**
- Verify jobs exist in database
- Check slug format
- Verify dynamic route configuration

### Issue: Slow page load
**Solution:**
- Check database query performance
- Enable caching
- Optimize images
- Review Vercel function timeout

### Issue: Build fails
**Solution:**
- Check build logs in Vercel
- Verify all dependencies are installed
- Test build locally first
- Check for TypeScript errors

## Useful Commands

```bash
# Deploy manually (if needed)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# View environment variables
vercel env ls
```

## Resources

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Documentation:** https://vercel.com/docs
- **Next.js on Vercel:** https://nextjs.org/docs/deployment
- **Google Search Console:** https://search.google.com/search-console
- **Project SEO Setup:** See `docs/SEO_SETUP.md`

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review this guide
3. Check Vercel status: https://www.vercel-status.com/
4. Contact Vercel support if needed

---

**Last Updated:** January 2026  
**Deployment Platform:** Vercel  
**Production URL:** https://clear-sarkari-exam.vercel.app
