module.exports = {
  debug: process.env.NODE_ENV === 'development',
  defaultNS: 'home',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cn', 'jp'],
    fallbackLng: {
      'default': ['en'],
      'ja': ['jp'],
    },
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
