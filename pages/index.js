import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import {useContext} from 'react';
import { IdentityContext } from './_app';

import Link from 'next/link';
import Date from '../components/date';
export async function getStaticProps() {
  const allPostsData = getSortedPostsData('panqp');
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  const {identity} = useContext(IdentityContext);
  const author = (identity) ? 'Qiping Pan' : 'Retep';
  const postsData = allPostsData.filter(p => p.author === author);
  return (
    <>

        <Layout home>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {postsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
            ))}
          </ul>
        </section>
      </Layout>
    </> 
  );
}