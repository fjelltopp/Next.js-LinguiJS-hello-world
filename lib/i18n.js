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
