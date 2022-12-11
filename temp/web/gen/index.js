cpp_run = Module.cwrap('cpp_run', null, [null]);
cpp_update_actions = Module.cwrap('cpp_update_actions', null, [null]);
cpp_get_actions_ptr = Module.cwrap('cpp_get_actions_ptr', "number", [null]);
cpp_get_path_ptr = Module.cwrap('cpp_get_path_ptr', "number", [null]);
cpp_get_actions_len = Module.cwrap('cpp_get_actions_len', "number", [null]);
cpp_get_path_len = Module.cwrap('cpp_get_path_len', "number", [null]);
cpp_set_path_len = Module.cwrap('cpp_set_path_len', null, ["number"]);


// let {
//   cpp_run,
//   cpp_update_actions,
//   cpp_get_actions_ptr,
//   cpp_get_path_ptr,
//   cpp_get_actions_len,
//   cpp_get_path_len,
//   cpp_set_path_len,
//   memory,
// } = instance.exports;

const MAX_ACTION_NUM = 64;
const actionsOffset = cpp_get_actions_ptr(); // get address of actions array

const pathOffset = cpp_get_path_ptr();

let Uint16View = new Uint16Array(memory.buffer);

let Uint8View = new Uint8Array(memory.buffer);
function run(nextMove) {
  const path_len = cpp_get_path_len();
  Uint16View.set([nextMove.y << (8 + nextMove.x)], pathOffset + path_len);
  cpp_set_path_len(path_len + 1);
  const ret = cpp_run();
  return {
    x: ret & 0xff, // lower 8 bits
    y: ret >> 8, // upper 8 bits
  };
}
function getActions() {
  cpp_update_actions();
  const action_len = cpp_get_actions_len();
  const subarray = Uint16View.subarray(
    actionsOffset,
    actionsOffset + action_len
  );
  const retArr = [];
  subarray.forEach((n) => {
    retArr.push({
      x: n & 0xff,
      y: n >> 8,
    });
  });
  return retArr;
}
