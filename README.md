# Configuring LinguiJS translations in Next.js
This is an example repo showing how LinguiJS can be integrated into a hello world Next.js app to provide translations using `.po` files.

## 1) Set up Next.js
- run `$ yarn create next-app`
- Run your app using `$ yarn dev`
- Go to `http://localhost:3000` in your browser

## 2) Configure Next.js internationalization
Set the conents of your `next.config.js` file to:
```
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'pt'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
```

You should now be able to access `/fr` and `/pt` locales.

Going to `/en` should automatically redirect to `/` as that's our default locale.

## 3) Install and configure LinguiJS
- All changes for this step can be found [here](https://github.com/fjelltopp/Next.js-LinguiJS-hello-world/commit/35219748881e3939489b6ead1ddb7706b535ab01)
- Install [LinguiJS](https://lingui.js.org).

Let's set all our locale settings in `locales/config.js`
```
const enLocale = {
    id: 'en',
    name: 'English',
    emoji: '🇬🇧'
}

const frLocale = {
    id: 'fr',
    name: 'Français',
    emoji: '🇫🇷'
}

const ptLocale = {
    id: 'pt',
    name: 'Português',
    emoji: '🇵🇹'
}

const supportedLocales = [enLocale, frLocale];
const unsupportedLocales = [ptLocale];
const defaultLocale = supportedLocales[0];

module.exports = {
    supportedLocales,
    unsupportedLocales,
    defaultLocale,
    i18n: {
        locales: supportedLocales.map(locale => locale.id),
        defaultLocale: defaultLocale.id
    }
}
```

Now we need to configure Next.js to using our locales by updating `next.config.js` file:
```
const localesConfig = require('./locales/config');

const nextConfig = {
  reactStrictMode: true,
  ...localesConfig,
}

module.exports = nextConfig
```

LinguiJS also needs to import our locale config, create a `lingui.config.js` file with:
```
const { i18n } = require('./locales/config');

module.exports = {
    locales: i18n.locales,
    catalogs: [
        {
            path: 'locales/{locale}/messages',
            include: ['pages', 'components', 'lib']
        }
    ],
    format: 'po'
}
```

Now we need Next.js to inform LinguiJS which locale to set the page content to when the url changes. Create a `lib/i18n.js` file with the following:
```
import { i18n } from '@lingui/core';
import * as pluralsLibrary from 'make-plural/plurals';
import * as localesConfig from '../locales/config';

localesConfig.i18n.locales.map(locale => {
    const plurals = pluralsLibrary[locale];
    if (plurals) {
        i18n.loadLocaleData({ [`${locale}`]: { plurals } });
    } else {
        const error = `Cannot find plurals for ${locale}`;
        console.error(error);
        throw new Error([error]);
    }
})

export async function activateLocale(locale) {
    const { messages } = await import(`../locales/${locale}/messages`);
    i18n.load(locale, messages);
    i18n.activate(locale);
}
```

Finally update the `pages/_app.js` file to use the `I18nProvider` and import our `activateLocale` which updates the active LinguiJS catalog:
```
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
```

## 4) Adding a Locale Selector
- All changes for this step can be found [here](https://github.com/fjelltopp/Next.js-LinguiJS-hello-world/commit/79e46fb03ce6347ea808f547121f41aeb00d7b73)
- `$ yarn add react-cookie` so that we can presist the user's locale between sessions

Create a simple locale selector like so:
```
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { supportedLocales } from '../locales/config';

export default function LocaleSelector() {
    const router = useRouter();
    const { pathname, asPath, query, locale } = router;
    const [cookies, setCookie] = useCookies(['NEXT_LOCALE']);

    const currentLocale = supportedLocales.filter(
        x => x.id === locale
    )[0]

    const updateLocale = locale => {
        setCookie('NEXT_LOCALE', locale, { path: '/' });
        router.push({ pathname, query }, asPath, { locale })
    }

    return (
        <select
            value={currentLocale.id}
            onChange={e => updateLocale(e.target.value)}
        >
            {supportedLocales.map(locale =>
                <option key={locale.id} value={locale.id}>
                    {locale.emoji + ' ' + locale.name}
                </option>
            )}
        </select>
    )

}
```

## 5) All done
- Run `$ yarn extract` to generate `/locales/<LOCALE>/messages.po` for each configured locale.
- Update the `.po` files with your desired translations.
- Run `$ yarn compile` to convert all `messages.po` files to `messages.js` and your app is ready to go!

# Optional Extras

## Automatically compile .po files to .js files
When running `$ yarn compile`, a `messages.js` is generted off each `.po` file which is then used by the Nextjs app. The only catch is that there isn't a need to commit the `.js` files to git and it could lead to confusion. This is why we have done the following:
- Add `$ yarn compile` to the build process
- Add `locales/*/messages.js` to the `.gitignore`


## Sending the locale in API requests
You can also send the locale info as a [Accept-Language header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) to all axios api requests:
```
export function baseAxiosConfig(locale) {
    return {
        axios: axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
            headers: {
                'Accept-Language': locale
            }
        })
    }
}
```

## Get Jest tests working by mocking the locale
If you have Jest tests set up with the app, they are very likely to fail after adding the `I18nProvider` to `pages/_app.js` as it requires an `i18n` provider. This can be solved by creating a `tests/i18nProvider.js` file:
```
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { en } from 'make-plural/plurals';
import { messages } from '../locales/en/messages';

i18n.load({ en: messages })
i18n.loadLocaleData({ en: { plurals: en } });

i18n.activate('en');

export default function wrapper({ children }) {
    return (
        <I18nProvider i18n={i18n}>
            {children}
        </I18nProvider>
    )
} 
```

Then update all tests with:
```
import wrapper from '../../i18nProvider';

...

render(<h1>hello world</h1>, { wrapper });
```