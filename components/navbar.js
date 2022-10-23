import styles from "./navbar.module.css";
import Link from 'next/link';
const entries = [
    {
        text: "Github",
        link: 'https://github.com/ppppqp/ppppqp.github.io'
    },
    
    {
        text: "About",
        link: '/about'
    },
    {
        text: "Home",
        link: '/'
    },

];
export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.mask}>
        <div className={styles.entries}>
                {
                    entries.map(e =>{
                        return <div className={styles.entry} key={e.text} >
                                <Link href={e.link} ><a className={styles['entry-color']}>{e.text}</a></Link>
                        </div>
                    })
                }
            </div>
      </div>

    </div>
  );
}
