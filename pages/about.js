import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
function getAge(){
    const d = new Date();
    return d.getFullYear()-2000;
}
function getRemainingYears(){
    const d = new Date();
    return 2050 - d.getFullYear();
}
export default function About() {
    return (<Layout home>
    <div className={utilStyles.lightText}>Male, {getAge()}.</div>
    <div className={utilStyles.lightText}>{getRemainingYears()} years left before becoming bald, overweight and useless.</div> 

    {/* <h2 className={utilStyles.headingMd}>Publication</h2> */}

    </Layout>)
}