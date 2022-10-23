
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import { IdentityContext } from '../pages/_app';
import { useContext } from 'react';

const getConfig = (identity) => ({
    imageSrc: identity ? "/images/profile.jpg" : "/images/profile_retep.png",
    name: identity ? "Qiping Pan" : "Retep"
})
export default function Avartar({imageSize, textStyle, enableSwitch}){
    const {identity, toggleId} = useContext(IdentityContext);
    const config = getConfig(identity);
    return <>
            <Image
              priority
              src={config.imageSrc}
              className={utilStyles.borderCircle}
              height={imageSize}
              width={imageSize}
              onDoubleClick={() => enableSwitch && toggleId(!identity)}
              alt=""
            />
            <h1 className={utilStyles[textStyle]}>{config.name}</h1>
    </>
}