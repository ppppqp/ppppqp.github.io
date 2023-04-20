
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import styles from './tagger.module.css';
const allTags = ['Tech', 'Random']
export default function Tagger({setTag, curTag}){
    return <>
        <div className={styles.wrapper}>
            {
                allTags.map(tag =>{
                    const classNames =  (tag === curTag) ? `${styles.item} ${styles.chosen}` :styles.item;
                    return (
                    <div className={classNames} key={tag} onClick={()=>setTag(tag)}>
                            {tag}
                    </div>
                )})
            }
        </div>
    </>
}