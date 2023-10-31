import { useCallback, useEffect, useState } from "react";
import styles from "./wasmViz.module.css";
import cls from 'classnames';
const bytes = [
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x8a, 0x80, 0x80, 0x80,
  0x00, 0x02, 0x60, 0x01, 0x7f, 0x01, 0x7f, 0x60, 0x00, 0x01, 0x7f, 0x03, 0x83,
  0x80, 0x80, 0x80, 0x00, 0x02, 0x00, 0x01, 0x04, 0x84, 0x80, 0x80, 0x80, 0x00,
  0x01, 0x70, 0x00, 0x00, 0x05, 0x83, 0x80, 0x80, 0x80, 0x00, 0x01, 0x00, 0x01,
  0x06, 0x81, 0x80, 0x80, 0x80, 0x00, 0x00, 0x07, 0x97, 0x80, 0x80, 0x80, 0x00,
  0x03, 0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02, 0x00, 0x03, 0x66, 0x69,
  0x62, 0x00, 0x00, 0x04, 0x6d, 0x61, 0x69, 0x6e, 0x00, 0x01, 0x0a, 0xd7, 0x80,
  0x80, 0x80, 0x00, 0x02, 0xc6, 0x80, 0x80, 0x80, 0x00, 0x01, 0x02, 0x7f, 0x41,
  0x01, 0x21, 0x02, 0x02, 0x40, 0x20, 0x00, 0x41, 0x01, 0x72, 0x41, 0x01, 0x46,
  0x0d, 0x00, 0x20, 0x00, 0x41, 0x7e, 0x6a, 0x21, 0x00, 0x41, 0x01, 0x21, 0x02,
  0x03, 0x40, 0x20, 0x00, 0x41, 0x01, 0x6a, 0x10, 0x00, 0x20, 0x02, 0x6a, 0x21,
  0x02, 0x20, 0x00, 0x41, 0x01, 0x72, 0x21, 0x01, 0x20, 0x00, 0x41, 0x7e, 0x6a,
  0x21, 0x00, 0x20, 0x01, 0x41, 0x01, 0x47, 0x0d, 0x00, 0x0b, 0x0b, 0x20, 0x02,
  0x0b, 0x86, 0x80, 0x80, 0x80, 0x00, 0x00, 0x41, 0x05, 0x10, 0x00, 0x0b,
];

const parsedBytes = [];
/*
interface ParsedByte {
  section: which section does it belong to
  range: index range to which they together make a meaningful content
  description: the description for all those bytes
}
*/

function parse() {
  // fill in parsed bytes
  parseHeader();
  parseType();
  parseFunction();
  parseTable();
  parseMemory();
  // parseStart();
  // parseElement();
  parseGlobal();
  parseExport();
  parseCode();
  // parseData();
}

parse();
function parseHeader() {
  const section = "Meta";
  const magic = {
    start: 0,
    end: 4,
  }
  formatI32Range(section, magic, ()=>"Magic bytes");
  const protocol = {
    start: 5,
    end: 9,
  }
  formatI32Range(section, protocol, () => "WASM Protocol Version 1");
}

function parseType() {
  const section = "Type";
  parseId(section);
  parseSize(section);
  const entityCount = readI32(bytes, parsedBytes.length);
  formatI32Range(
    section,
    entityCount,
    (I32) => `There are ${I32.result} function type definitions`
  );
  for (let i = 0; i < entityCount.result; i++) {
    formatByte(section, () => "The entity is of Function Type");
    const paramCount = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      paramCount,
      (I32) => `There are ${I32.result} input parameters for this function`
    );
    for (let j = 0; j < paramCount.result; j++) {
      // const type = bytes[parsedBytes.length] === '7f' ? 'i32'
      formatByte(
        section,
        () => `The #${j + 1} parameter for the #${i} function type is i32`
      );
    }
    const resultCount = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      resultCount,
      (I32) => `There are ${I32.result} return values for this function`
    );
    for (let j = 0; j < resultCount.result; j++) {
      // const type = bytes[parsedBytes.length] === '7f' ? 'i32'
      formatByte(
        section,
        () => `The #${j + 1} return value for the #${i} function type is i32`
      );
    }
  }
}

function parseFunction() {
  const section = "Function";
  parseId(section);
  parseSize(section);
  const functionCount = readI32(bytes, parsedBytes.length);
  formatI32Range(
    section,
    functionCount,
    (I32) => `There are ${I32.result} functions`
  );
  for (let i = 0; i < functionCount.result; i++) {
    const typeIndex = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      typeIndex,
      (I32) =>
        `The #${i} function is of the #${typeIndex.result} type in Type section`
    );
  }
}

function parseTable() {
  const section = "Table";
  parseId(section);
  parseSize(section);
  const tableCount = readI32(bytes, parsedBytes.length);
  formatI32Range(
    section,
    tableCount,
    (I32) => `There are ${I32.result} table in Table section`
  );
  for (let i = 0; i < tableCount.result; i++) {
    formatByte(section, () => `The element type is Function`);
    formatByte(section, (v) => `The element does not have maximal size`);
    const limitInitial = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      limitInitial,
      (I32) => `The limit initial(minimal size) for this table is ${I32.result}`
    );
    // TODO: if maximal size present, parse maximal size
  }
}

function parseMemory() {
  const section = "Memory";
  parseId(section);
  parseSize(section);
  const memoryCount = readI32(bytes, parsedBytes.length);
  formatI32Range(section, memoryCount, (I32) => `There are ${I32.result} table`);
  for (let i = 0; i < memoryCount.result; i++) {
    formatByte(section, () => "The element does not have maximal size");
    const limitInitial = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      limitInitial,
      (I32) => `The limit initial(minimal size) for this table is ${I32.result}`
    );
    // TODO: if maximal size present, parse maximal size
  }
}

function parseGlobal() {
  const section = "Global";
  parseId(section);
  parseSize(section);
  const globalCount = readI32(bytes, parsedBytes.length);
  formatI32Range(
    section,
    globalCount,
    (I32) => `There are ${I32.result} global variables`
  );

  for (let i = 0; i < globalCount.result; i++) {
    formatByte(section, () => "The value type is");
    formatByte(section, () => "");
    // TODO: initial expression
  }
}

function parseExport() {
  const section = 'Export';
  parseId(section);
  parseSize(section);
  const exportCount = readI32(bytes, parsedBytes.length);
  formatI32Range(section, exportCount, (I32) => `There are ${I32.result} export variables in total`);
  const exportDescription = (d) => {
    if(d === 0) return 'Function';
    if(d === 2) return 'Memory';
    // TODO: other export description
  }
  for (let i = 0; i < exportCount.result; i++){
    const fieldLen = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      fieldLen,
      (I32) => `Field length for this export variable is ${I32.result}`
    );
    const fieldStr = readStr(bytes, parsedBytes.length, fieldLen.result);
    formatI32Range(section, fieldStr, (str) => `The name for this export variable is '${str.result}'`);
    formatByte(section, (d)=>`The type for this export is ${exportDescription(d)}`);
    const index = readI32(bytes, parsedBytes.length);
    formatI32Range(section, index, (I32) => `The index into of the value into its own section is ${I32.result}`);
  }


}
function parseCode() {
  const section = "Code";
  parseId(section);
  parseSize(section);
  const functionDefCount = readI32(bytes, parsedBytes.length);
  formatI32Range(
    section,
    functionDefCount,
    (I32) => `There are ${I32.result} function definitions`
  );

  for (let i = 0; i < functionDefCount.result; i++) {
    const bodySize = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      bodySize,
      (I32) => `The body size of the #${i + 1} function is ${I32.result}`
    );
    const startPos = parsedBytes.length;
    const types = [];
    const typeSize = readI32(bytes, parsedBytes.length);
    formatI32Range(
      section,
      typeSize,
      (I32) => `There are ${I32.result} types for local variable`
    );
    for (let j = 0; j < typeSize.result; j++) {
      const variableCount = readI32(bytes, parsedBytes.length);
      formatI32Range(
        section,
        variableCount,
        (I32) => `There are ${I32.result} variables of the i32 type`
      );
      formatByte(section, () => `The type is i32`);
    }
    // the rest is body
    readInstruction(bytes, parsedBytes.length, bodySize.result + startPos - parsedBytes.length);
  }
}

// walker utils
function readI32(bytes, start) {
  let value;
  let result = 0;
  let shift = 0;
  let index = 0;
  while (true) {
    value = bytes[start + index];
    index += 1;
    result |= (value & 0x7f) << shift;
    shift += 7;
    if (shift >= 32 || (value & 0x80) === 0) {
      break;
    }
  }
  // if(shift < 32 && value & 0x40 !== 0){
  //   result |= -(1 << shift);
  // }
  return {
    start,
    end: start + index,
    result,
  };
}

function readStr(bytes, start, size){
  let result = '';
  for(let i = 0; i < size; i++){
    // TODO: fix performance issue
    result += String.fromCharCode(bytes[start + i]);
  }
  return {
    start,
    end: start + size,
    result
  }
}

function mapOpCode(code){
  switch(code){
    case 0x00: {
      return 'Unreachable';
    }
    case 0x02: {
      return 'Block';
    }
    case 0x03: {
      return 'Loop';
    }
    case 0x10: {
      return 'Call';
    }
    case 0x0D: {
      return 'BrIf';
    }
    case 0x20: {
      return 'LocalGet';
    }
    case 0x21: {
      return 'LocalSet';
    }
    case 0x22: {
      return 'LocalTee';
    }
    case 0x23: {
      return 'GlobalGet';
    }
    case 0x24: {
      return 'GlobalSet';
    }
    case 0x40: {
      return 'BlockTypeE';
    }
    case 0x41: {
      return 'I32Const';
    }
    case 0x46: {
      return 'I32Eq';
    }
    case 0x47: {
      return 'I32Ne';
    }
    case 0x6a: {
      return 'I32Add';
    }
    case 0x72: {
      return 'I32Or';
    }
    case 0xb: {
      return 'End';
    }
    default: {
      console.log(code);
      console.log('Command not recoginzed')
      return 'Error';
    }
  }
}


function readInstruction(bytes, start, size){
  let i = start;
  const section = 'Code';
  console.log('read instruction start', start, size)
  while(i < start + size){
    const inst = mapOpCode(bytes[i])
    if(inst === 'Error') break;
    switch(inst){

      case 'I32Const':{
        i += 1;
        const opCode = formatOpCode(section, inst);
        const value = readI32(bytes, i);
        i = value.end;
        formatI32Range(section, value, (I32) => `The specified I32 const value is ${I32.result}`);
        // some adjustment on generalRange
        // opCode.rangeStart = opCode.rangeStart;
        opCode.rangeEnd = i;
        for(let j = value.start; j < value.end; j++){
          parsedBytes[j].rangeStart = opCode.rangeStart;  
        }
        break;
      }
      case 'Call':{
        i += 1;
        const opCode = formatOpCode(section, inst);
        // function index
        i += 1;
        const funIdx = formatByte(section, (v) => `The called function index is ${v}`);
        opCode.rangeEnd = i;
        funIdx.rangeStart = opCode.rangeStart;
        break;
      }
      case 'LocalSet':
      case 'LocalGet': {
        // local var index
        i += 1;
        const opCode = formatOpCode(section, inst);
        i += 1;
        const varIdx = formatByte(section, (v) => `The index for the local variable to retrieve is ${v}`);
        opCode.rangeEnd = i;
        varIdx.rangeStart = opCode.rangeStart;
        break;
      }
      case 'Unreachable':
      case 'Nop': {
        i += 1;
        formatOpCode(section, inst);
        break;
      }
      case 'Block':
      case 'Loop': {
        i += 1;
        const opCode = formatOpCode(section, inst);
        i += 1;
        const blockType = formatByte(section, (v) => `The block type is epsilon`);
        opCode.rangeEnd = i;
        blockType.rangeStart = opCode.rangeStart;
        break;
      }
      case 'End':{
        i += 1;
        formatOpCode(section, inst);
        break;
      }
      case 'I32Eq':
      case 'I32Ne':
      case 'I32Or':
      case 'I32Add':{
        i += 1;
        formatOpCode(section, inst);
        break;
      }
      case 'BrIf':{
        i += 1;
        const opCode = formatOpCode(section, inst);
        i += 1;
        const level = formatByte(section, (v) => `This branch will jump out of ${v} levels of block`);
        opCode.rangeEnd = i;
        level.rangeStart = opCode.rangeStart;
        break;
      }
      default: {
        console.log('Not recognized');
      }
    }
  }
}

// format utils
function formatByte(section, description) {
  parsedBytes.push({
    section,
    byte: bytes[parsedBytes.length],
    rangeStart: parsedBytes.length,
    rangeEnd: parsedBytes.length + 1,
    description: description(bytes[parsedBytes.length]),
  });
  return parsedBytes[parsedBytes.length - 1];
}

function formatOpCode(section, inst){
  return formatByte(section, ()=>`The Opcode for ${inst}`)
}

function formatI32Range(section, I32, description) {
  const { start, end, result } = I32;
  for (let i = start; i < end; i++) {
    parsedBytes.push({
      section,
      byte: bytes[i],
      rangeStart: start,
      rangeEnd: end,
      description: description(I32),
    });
  }
  return parsedBytes[parsedBytes.length - 1];
}

// parser utils

function parseId(section) {
  return formatByte(section, () => `The id for ${section} section`);
}

function parseSize(section) {
  const I32 = readI32(bytes, parsedBytes.length);
  console.log(I32.start, I32.end);
  return formatI32Range(
    section,
    I32,
    (I32) => `total number of bytes in the ${section} section is ${I32.result}`
  );
}



function Brick(props) {
  const { id, data, highlight, tooltip, setTooltip, setHighlight} = props;
  return (
    <div className={styles.brickContainer}>
      {tooltip && <div className={styles.tooltip}>
        <div><span className={styles.bold}> {data.section}</span></div>
        <div> {data.description} </div>
      </div>}
      <div className={cls(styles.brick, tooltip && styles.selected, highlight && styles.highlight)} onClick={()=>{
        setTooltip(id);
        setHighlight( new Array(data.rangeEnd - data.rangeStart).fill().map((d, i) => i + data.rangeStart));
      }}>
        {data.byte?.toString(16).padStart(2, "0")}
      </div>
    </div>
  );
}

const initialHighlight = bytes.map((b) => false);
export default function wasmViz() {
  const [highlight, setHighlight] = useState([]);
  const [tooltip, setTooltip] = useState(-1);
  // const updateHighlight = useCallback(() => {
    
  // }, []);
  useEffect(()=>{
    const id = window.addEventListener('click', (e)=>{
      const paths = e.composedPath();
      if(paths.some(p => p.className=== styles.brickContainer)){
        return;
      }
      setTooltip(-1);
      setHighlight([]);
    });
    // return ()=>window.removeEventListener()
  }, []);
  return (
    <div className={styles.container}>
      {parsedBytes.map((b, i) => (
        <Brick data={b} id={i} highlight={highlight.indexOf(i) > -1} tooltip={i === tooltip} setTooltip={setTooltip} setHighlight={setHighlight}/>
      ))}
    </div>
  );
}
