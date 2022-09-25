import Home from 'components/Home';
import React from 'react';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import {useTranslation} from 'next-i18next';

export default function IndexPage() {
  const {t} = useTranslation('home');

  return (
    <>
      <Head>
        <title>{`${t('meta.title')} | ${t('SenseiHelper')}`}</title>
      </Head>
      <Home/>
    </>
  );
}

export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
