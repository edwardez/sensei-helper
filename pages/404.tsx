import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';
import {Typography} from '@mui/material';

const Custom404 = () => {
  const {t} = useTranslation('home');

  return <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh">
    <Typography variant={'h5'}>{t('error404')}</Typography>
  </Box>;
};

export default Custom404;

export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
