import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import Link from 'next/link';
import Navbar from './navbar';
import Avartar from './Avartar';
const name = 'Qiping Pan';
export const siteTitle = 'Qiping Pan\'s Blog';


const config = {
  panqp: {
    name: 'Qiping Pan',
    siteTitle: 'Qiping Pan\'s Blog'
  },
  retep: {
    name: 'Retep',
    siteTitle: 'Retep\'s Blog'
  }
}
export default function Layout({ children, home }) {
  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Developer Blog of Qiping Pan"
        />
        <meta
          property="og:image"
          content={`/open_image.png`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Avartar
              imageSize={144}
              textStyle="heading2Xl"
              name="Qiping Pan"
              enableSwitch={true}
            />
          </>
        ) : (
          <>
          <Avartar
              imageSize={108}
              textStyle="headingLg"
              name="Qiping Pan"
              enableSwitch={false}
            />
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
    
    </>
    
  );
}