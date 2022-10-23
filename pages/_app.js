// `pages/_app.js`
import '../styles/global.css';
import {useState, createContext} from 'react'
import { useRouter } from 'next/router'
export const IdentityContext = createContext({
  identity: true,
  toggleId: () => {},
});
export default function App({ Component, pageProps, location}) {
  let params = undefined;
  if(typeof window !== 'undefined'){
    console.log(window.location.pathname)
    params = new URLSearchParams(window.location.search);
  }
  const initialId = (params) ? params.get('id') === 'panqp' : true;
  const [identity, toggleId] = useState(initialId);
  console.log(identity);
  const value = {identity, toggleId};
  return <IdentityContext.Provider value={value}>
      <Component {...pageProps} />
    </IdentityContext.Provider>;
}
