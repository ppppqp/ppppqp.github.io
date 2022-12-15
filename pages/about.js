import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
export default function About() {
    return (<Layout home>
    <div className={utilStyles.lightText}>Male, 22.</div>
    {/* <h2 className={utilStyles.headingMd}>Publication</h2> */}
    </Layout>)
}