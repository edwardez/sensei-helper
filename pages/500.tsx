import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';

const Custom500 = () => {
  const {t} = useTranslation('home');

  return <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh">
    <Typography variant={'h5'}>{t('error500')}</Typography>
  </Box>;
};

export default Custom500;

export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
