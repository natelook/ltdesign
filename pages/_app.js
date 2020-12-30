import { CommerceProvider } from '@bigcommerce/storefront-data-hooks';
import { UiContextProvider } from '../components/context';
import Layout from '../components/layout';
import '../styles/tailwind.css';

import 'intersection-observer';

function MyApp({ Component, pageProps, router, locale = 'en-US' }) {
  return (
    <UiContextProvider>
      <CommerceProvider locale={locale}>
        <Layout pathname={router.pathname}>
          <Component {...pageProps} />
        </Layout>
      </CommerceProvider>
    </UiContextProvider>
  );
}

export default MyApp;
