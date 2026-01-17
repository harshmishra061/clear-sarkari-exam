# SEO Quick Reference Guide

Quick reference for maintaining and optimizing SEO for Clear Sarkari Exam.

## 📋 Daily Tasks

- [ ] Post new job notifications with proper SEO metadata
- [ ] Update expired job statuses
- [ ] Monitor Google Search Console for errors
- [ ] Check site uptime and performance

## 📊 Weekly Tasks

- [ ] Review search performance metrics
- [ ] Check for broken links
- [ ] Update sitemap (automatic, but verify)
- [ ] Monitor Core Web Vitals
- [ ] Review top search queries

## 📈 Monthly Tasks

- [ ] Analyze traffic trends
- [ ] Update meta descriptions for low CTR pages
- [ ] Review and optimize slow-loading pages
- [ ] Check mobile usability
- [ ] Update content based on search insights
- [ ] Review and fix crawl errors

## 🎯 Key SEO URLs

| URL | Purpose | Check |
|-----|---------|-------|
| `/robots.txt` | Crawling rules | Accessible |
| `/sitemap.xml` | Site structure | Valid XML |
| `/manifest.json` | PWA config | Valid JSON |
| `/opengraph-image` | Social sharing | Renders correctly |

## 📝 Creating SEO-Optimized Job Posts

### Title Best Practices
```
✅ Good: "SSC CGL 2026 Notification - 10000+ Posts"
❌ Bad: "New Job Posted"

Tips:
- Include organization name
- Add year
- Mention vacancy count if significant
- Keep under 60 characters
```

### Description Best Practices
```
✅ Good: "SSC CGL 2026 notification for 10000+ posts. Apply online for Combined Graduate Level Examination. Check eligibility, important dates, and application process."
❌ Bad: "New job notification available."

Tips:
- Include key details
- Use relevant keywords naturally
- Keep 150-160 characters
- Include call-to-action
```

### Slug Best Practices
```
✅ Good: "ssc-cgl-2026-notification"
❌ Bad: "job-123" or "new-post-today"

Tips:
- Use lowercase
- Separate words with hyphens
- Include relevant keywords
- Keep it readable and meaningful
```

## 🔍 SEO Metadata Fields

When creating/editing jobs, fill these SEO fields:

```typescript
{
  title: "Job Title",
  slug: "job-title-slug",
  organization: "Organization Name",
  description: "Detailed description...",
  seo: {
    title: "Custom SEO Title (optional)",
    description: "Custom meta description (optional)"
  }
}
```

## 📊 Monitoring Tools

### Google Search Console
- **URL:** https://search.google.com/search-console
- **Check:** Index coverage, search performance, mobile usability

### PageSpeed Insights
- **URL:** https://pagespeed.web.dev/
- **Target:** Score > 90 for both mobile and desktop

### Rich Results Test
- **URL:** https://search.google.com/test/rich-results
- **Check:** JobPosting schema validation

## 🚨 Common Issues & Fixes

### Issue: Pages not indexed
**Solution:**
1. Check robots.txt isn't blocking
2. Verify sitemap includes the page
3. Request indexing in Search Console
4. Ensure page returns 200 status code

### Issue: Low click-through rate
**Solution:**
1. Improve title and meta description
2. Add structured data
3. Make titles more compelling
4. Include numbers/dates in titles

### Issue: Slow page load
**Solution:**
1. Optimize images
2. Enable caching
3. Minimize JavaScript
4. Use CDN for static assets

### Issue: Mobile usability errors
**Solution:**
1. Test on actual mobile devices
2. Fix touch target sizes
3. Ensure text is readable
4. Check viewport settings

## 📈 Key Metrics to Track

### Traffic Metrics
- Organic search traffic
- Page views per session
- Bounce rate
- Average session duration

### Search Metrics
- Total impressions
- Total clicks
- Average CTR
- Average position

### Technical Metrics
- Core Web Vitals (LCP, FID, CLS)
- Page load time
- Mobile vs desktop traffic
- Index coverage

## 🎯 SEO Score Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse SEO Score | > 95 | - |
| PageSpeed (Mobile) | > 90 | - |
| PageSpeed (Desktop) | > 95 | - |
| Core Web Vitals | All Green | - |
| Mobile Usability | 0 errors | - |
| Index Coverage | 100% | - |

## 🔧 Quick Commands

```bash
# Build and test production
npm run build
npm start

# Test SEO URLs locally
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/manifest.json

# Check for broken links (install first: npm i -g broken-link-checker)
blc http://localhost:3000 -ro

# Lighthouse audit (install first: npm i -g lighthouse)
lighthouse http://localhost:3000 --view
```

## 📱 Social Media Optimization

### Open Graph Tags (Facebook, LinkedIn)
- Title: 60-90 characters
- Description: 200-300 characters
- Image: 1200x630px (already generated)

### Twitter Cards
- Title: 70 characters max
- Description: 200 characters max
- Image: 1200x630px (already generated)

## ✅ Pre-Launch Checklist

- [ ] `NEXT_PUBLIC_BASE_URL` set to production URL
- [ ] All icon files created (192x192, 512x512)
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google
- [ ] robots.txt accessible
- [ ] HTTPS/SSL enabled
- [ ] 404 page working
- [ ] All pages return correct status codes
- [ ] Mobile responsive on all devices
- [ ] Structured data validated
- [ ] Open Graph tags tested
- [ ] Page speed optimized

## 📞 Support Resources

- **Next.js SEO:** https://nextjs.org/learn/seo
- **Google Search Central:** https://developers.google.com/search
- **Schema.org:** https://schema.org/
- **Web.dev:** https://web.dev/

## 🎓 Learning Resources

### Beginner
- Google SEO Starter Guide
- Moz Beginner's Guide to SEO
- Web.dev Learn SEO

### Advanced
- Advanced Technical SEO
- JavaScript SEO
- International SEO

## 💡 Pro Tips

1. **Content is King:** Quality content ranks better than keyword stuffing
2. **Mobile First:** Google uses mobile-first indexing
3. **Speed Matters:** Fast sites rank higher
4. **User Experience:** Good UX leads to better rankings
5. **Fresh Content:** Regular updates signal active site
6. **Internal Linking:** Helps search engines understand structure
7. **Structured Data:** Enables rich results in search
8. **HTTPS:** Security is a ranking factor
9. **Avoid Duplicate Content:** Use canonical URLs
10. **Monitor Regularly:** SEO is an ongoing process

## 🔄 Regular Maintenance

### Every Release
- [ ] Test all SEO URLs
- [ ] Verify structured data
- [ ] Check page load speed
- [ ] Test mobile responsiveness
- [ ] Validate sitemap

### After Major Changes
- [ ] Request re-indexing
- [ ] Update sitemap
- [ ] Test all internal links
- [ ] Verify redirects
- [ ] Check for broken links

---

**Quick Access Links:**
- [Full SEO Setup Guide](./SEO_SETUP.md)
- [SEO Checklist](../SEO_CHECKLIST.md)
- [Main README](../README.md)
