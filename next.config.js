const {i18n} = require('./next-i18next.config');
const withPWA = require('next-pwa')({
  dest: 'public',
  publicExcludes: ['!noprecache/**/*', '!icons/apple-splash/**/*', '!images/equipments/@1/**/*'],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
};

module.exports = withPWA(nextConfig);
