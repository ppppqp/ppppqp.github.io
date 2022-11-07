
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';


const getConfig = () => ({
    imageSrc: "/images/profile.jpg",
    name: "Qiping Pan"
})
export default function Avartar({imageSize, textStyle}){
    const config = getConfig();
    return <>
            <Image
              priority
              src={config.imageSrc}
              className={utilStyles.borderCircle}
              height={imageSize}
              width={imageSize}
              alt=""
            />
            <h1 className={utilStyles[textStyle]}>{config.name}</h1>
    </>
}