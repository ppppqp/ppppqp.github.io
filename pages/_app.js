// `pages/_app.js`
import '../styles/global.css';
import {useState, createContext} from 'react'
import { useRouter } from 'next/router'
export const IdentityContext = createContext({
  identity: true,
  toggleId: () => {},
});
export default function App({ Component, pageProps, location}) {
  const [identity, toggleId] = useState(true);
  console.log(identity);
  const value = {identity, toggleId};
  return <IdentityContext.Provider value={value}>
      <Component {...pageProps} />
    </IdentityContext.Provider>;
}
