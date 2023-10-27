import WasmViz from "./wasmViz";


export default function Custom(props){
  console.log('custom')
  console.log(props.id)
  switch (props.id) { 
    case '2023-09-03-WASM-parser': {
      console.log('here')
      return <WasmViz />
    }
    default: return null;
  }
}