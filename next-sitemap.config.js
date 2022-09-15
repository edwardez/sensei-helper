/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sensei.help',
  generateRobotsTxt: true, // (optional)
  // ...other options
};
