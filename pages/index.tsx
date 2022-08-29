import Home from 'components/Home';
import React from 'react';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

export default function IndexPage() {
  return (<Home/>);
}

export const getServerSideProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
