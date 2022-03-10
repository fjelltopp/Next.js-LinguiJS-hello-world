import React, { useEffect } from 'react';
import '../styles/globals.css'
import { useRouter } from 'next/router';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { activateLocale } from '../lib/i18n';

function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();

  useEffect(() => {
    activateLocale(locale)
  }, [locale])

  return (
    <I18nProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nProvider>
  )
}

export default MyApp
