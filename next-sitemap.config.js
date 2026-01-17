/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://clear-sarkari-exam.vercel.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: true,
  exclude: ['/admin/*', '/api/*', '/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === '/' ? 'hourly' : 'daily',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
};
