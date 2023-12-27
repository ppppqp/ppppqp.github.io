import {load as loadWASM} from './wasmViz';
import {load as loadHelloWorld} from './hello-world';
export function loadAll(){
  loadWASM();
  loadHelloWorld();
}