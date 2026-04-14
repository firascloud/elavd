/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://elavd.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/admin', 
    '/admin/*', 
    '/*/admin', 
    '/*/admin/*',
    '/api*',
    '/*/api*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: [
          '/admin',
          '/*/admin',
          '/api',
          '/*/api',
        ],
      },
    ],
  },
}
