const {i18n} = require('./next-i18next.config');
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  publicExcludes: ['!noprecache/**/*', '!icons/apple-splash/**/*', '!images/equipments/@1/**/*'],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
    api: 'modern-compiler',
  },
};

module.exports = withPWA(nextConfig);
