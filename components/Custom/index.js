import {load as loadWASM} from './wasmViz';
import {load as loadHelloWorld} from './hello-world';
import  {load as loadImageWithCpation} from './image-with-caption';
import  {load as loadInlineWrapper} from './inline-wrapper';

// import {load as loadImageWithCpation} from './image-with-cpation';
export function loadAll(){
  loadWASM();
  loadHelloWorld();
  loadImageWithCpation();
  loadInlineWrapper();
}
