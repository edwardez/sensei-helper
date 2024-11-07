import Link from 'next/link';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import {useTranslation} from 'next-i18next';


export default function Privacy() {
  const {t} = useTranslation('home');

  return (<>
    <Head>
      <title>{t('privacy')}</title>
    </Head>
    <strong>Privacy Policy</strong>
    <p>
          Sensei Helper Developers built the Sensei Helper app as
          an Open Source app. This SERVICE is provided by
          Sensei Helper Developers at no cost and is intended for use as
          is.
    </p>
    <p>
          This page is used to inform visitors regarding our
          privacy policies.
    </p>
    <p><strong>Information Collection and Use</strong></p>
    <div>
      <p>
            The app uses Google Analytics to improve our service, however no personal identifiable data is ever collected or shared.
      </p>
      <p>
            Link to the privacy policy of third-party service providers used
            by the app
      </p>
      <ul>
        <li><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
      </ul>
    </div>
    <p><strong>Cookies</strong></p>
    <p>
          Cookies are files with a small amount of data that are
          commonly used as anonymous unique identifiers. These are sent
          to your browser from the websites that you visit and are
          stored on your device&apos;s internal memory.
    </p>
    <p>
          The app may use third-party code and libraries that use
          “cookies” to collect information and improve their services.
          You have the option to either accept or refuse these cookies
          and know when a cookie is being sent to your device. If you
          choose to refuse our cookies, you may not be able to use some
          portions of this Service.
    </p>
    <p><strong>Service Providers</strong></p>
    <p>
          We may employ third-party companies and
          individuals due to the following reasons:
    </p>
    <ul>
      <li>To facilitate our Service;</li>
      <li>To provide the Service on our behalf;</li>
      <li>To perform Service-related services; or</li>
      <li>To assist us in analyzing how our Service is used.</li>
    </ul>
    <p>
          We want to inform users of this Service
          that we do not knowingly collect personally
          identifiable information, so these third parties does not have
          a way we are aware of to identify our users.
    </p>
    <p><strong>Security</strong></p>
    <p>
          We value your trust in providing us your
          Personal Information, thus we are striving to use commercially
          acceptable means of protecting it. But remember that no method
          of transmission over the internet, or method of electronic
          storage is 100% secure and reliable, and we cannot
          guarantee its absolute security.
    </p>
    <p><strong>Links to Other Sites</strong></p>
    <p>
          This Service may contain links to other sites. If you click on
          a third-party link, you will be directed to that site. Note
          that these external sites are not operated by us.
          Therefore, We strongly advise you to review the
          Privacy Policy of these websites. We have
          no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party sites or
          services.
    </p>
    <p><strong>Children’s Privacy</strong></p>
    <div>
      <p>
            These Services do not address anyone under the age of 13.
            We do not knowingly collect personally
            identifiable information from children under 13 years of age. In the case
            We discover that a child under 13 has provided
            us with personal information, we immediately
            delete this from our servers. If you are a parent or guardian
            and you are aware that your child has provided us with
            personal information, please contact us so that
            we will be able to do the necessary actions.
      </p>
    </div>
    <p><strong>Changes to This Privacy Policy</strong></p>
    <p>
          We may update our Privacy Policy from
          time to time. Thus, you are advised to review this page
          periodically for any changes. We will
          notify you of any changes by posting the new Privacy Policy on
          this page.
    </p>
    <p>This policy is effective as of 2022-08-28</p>
    <p><strong>Contact Us</strong></p>
    <p>
          If you have any questions or suggestions about our
          Privacy Policy, do not hesitate to contact us at <Link href={'/about'}>about page</Link>
    </p>
  </>);
}


export const getStaticProps = async ({locale}:{locale: string}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
});
