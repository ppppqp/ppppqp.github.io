import WasmViz from "./wasmViz";


export default function Custom(props){
  console.log('custom')
  console.log(props.id)
  switch (props.id) { 
    case '2023-09-03-WASM-parser': {
      return <WasmViz />
    }
    case '2023-11-02-WASM-parser-cn': {
      return <WasmViz />
    }
    default: return null;
  }
}