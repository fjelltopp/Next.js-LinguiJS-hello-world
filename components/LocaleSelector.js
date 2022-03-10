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
