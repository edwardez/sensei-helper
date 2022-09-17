import BuiLinedText from 'components/bui/text/BuiLinedText';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {Trans, useTranslation} from 'next-i18next';
import Head from 'next/head';

const About = () => {
  const {t} = useTranslation(['about', 'home'], );

  return <>
    <Head>
      <title>{`${t('about', 'about', {ns: 'home'})} | ${t('meta.description', 'meta.description', {ns: 'home'})}`}</title>
    </Head>
    <BuiLinedText><div>{t('whatIsSenseiHelperTitle')}</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>{t('whatIsSenseiHelperContent')}</div>
    </BuiLinedText>
    <BuiLinedText><div>{t('freeToUseTitle')}</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>
        <Trans t={t} i18nKey="freeToUseContent">
          Yes. This app is free to use and <a href="https://github.com/edwardez/sensei-helper" target="_blank" rel="noopener noreferrer">open-sourced</a>
        </Trans>
      </div>
    </BuiLinedText>
    <BuiLinedText><div>{t('contactTitle')}</div></BuiLinedText>
    <BuiLinedText showVerticalDividerPrefix={false}>
      <div>
        <Trans t={t} i18nKey="contactContent">
          Please contact us on&nbsp;<a href="https://twitter.com/sensei_helper" target="_blank" rel="noopener noreferrer">Twitter</a>
          &nbsp;or&nbsp;<a href="https://github.com/edwardez/sensei-helper/issues" target="_blank" rel="noopener noreferrer">Github</a>.
        </Trans>
      </div>
    </BuiLinedText>
  </>;
};

export default About;


export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['about', 'home'])),
  },
});
