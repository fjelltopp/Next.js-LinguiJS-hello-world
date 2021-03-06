import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { t } from '@lingui/macro';
import { Trans } from '@lingui/react';
import LocaleSelector from '../components/LocaleSelector';

export default function Home() {

  function LinkToNextJs() {
    return <a href="https://nextjs.org">Next.js!</a>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{t`Create Next App`}</title>
        <meta name="description" content={t`Generated by create next app`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <LocaleSelector />

        <h1 className={styles.title}>
          <Trans
            id="Welcome to <0>LinkToNextJs</0>"
            components={{ LinkToNextJs: <LinkToNextJs /> }}
          />
        </h1>

        <p className={styles.description}>
          {t`Get started by editing`}
          <span> </span>
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>{t`Documentation`} &rarr;</h2>
            <p>{t`Find in-depth information about Next.js features and API.`}</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>{t`Learn`} &rarr;</h2>
            <p>{t`Learn about Next.js in an interactive course with quizzes!`}</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>{t`Examples`} &rarr;</h2>
            <p>{t`Discover and deploy boilerplate example Next.js projects.`}</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>{t`Deploy`} &rarr;</h2>
            <p>{t`Instantly deploy your Next.js site to a public URL with Vercel.`}</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t`Powered by`}
          <span> </span>
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )

}
