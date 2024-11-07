module.exports = {
  // debug: process.env.NODE_ENV === 'development',
  defaultNS: 'home',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
