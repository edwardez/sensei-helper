import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import Head from 'next/head';
import React from 'react';

const Custom500 = () => {
  const {t} = useTranslation('home');

  return (
    <>
      <Head>
        <title>{t('error500')}</title>
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Typography variant={'h5'}>{t('error500')}</Typography>
      </Box>
    </>
  );
};

export default Custom500;

export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
