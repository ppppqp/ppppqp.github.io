import Layout from '../../components/layout';
import NoSSRWrapper from '../../components/NoSSRWrapper';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { IdentityContext } from '../_app';
import {useContext} from 'react'
import Script from 'next/script'

export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}
export default function Post({ postData }) {
  const {identity, toggleId} = useContext(IdentityContext);
  // if(postData.author === 'Retep' && identity) toggleId(!identity);
  const scripts = (postData.scripts)
    ? postData.scripts.map(script => <Script src={script}/>)
    : <></>
  const content = (
      <Layout>
      <Head>
        <title>{postData.title}</title>
        {scripts}
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
  return (
    <>
      {
        postData.noSSR ? <NoSSRWrapper>{content}</NoSSRWrapper> : content
      }
    </>
  );
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
