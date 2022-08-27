module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cn', 'jp'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  nonExplicitSupportedLngs: true,
};
