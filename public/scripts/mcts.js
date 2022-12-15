// cpp_run = Module.cwrap('cpp_run', null, [null]);
// cpp_update_actions = Module.cwrap('cpp_update_actions', null, [null]);
// cpp_get_actions_ptr = Module.cwrap('cpp_get_actions_ptr', "number", [null]);
// cpp_get_path_ptr = Module.cwrap('cpp_get_path_ptr', "number", [null]);
// cpp_get_actions_len = Module.cwrap('cpp_get_actions_len', "number", [null]);
// cpp_get_path_len = Module.cwrap('cpp_get_path_len', "number", [null]);
// cpp_set_path_len = Module.cwrap('cpp_set_path_len', null, ["number"]);

// var nextMoveX;
// var nextMoveY;
// document.getElementById("getaction").addEventListener("click", () => {
//     getActions();
// });
// document.getElementById("mybutton").addEventListener("click", () => {
//     console.log(run_mcts({y:nextMoveY, x:nextMoveX}));
// });

// document.getElementById("nextmovex").addEventListener("change", (event) => {
//     nextMoveX = Number(event.target.value);
// });
// document.getElementById("nextmovey").addEventListener("change", (event) => {
//     nextMoveY = Number(event.target.value);
// });

// console.log(cpp_get_actions_ptr)
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

// const MAX_ACTION_NUM = 64;
// cpp_run();
// const actionsOffset = cpp_get_actions_ptr(); // get address of actions array

// const pathOffset = cpp_get_path_ptr();

// let Uint16View = new Uint16Array(memory.buffer);

// let Uint8View = new Uint8Array(memory.buffer);

function runMcts(nextMove) {
    console.log(nextMove)
    const cpp_run = Module.cwrap("cpp_run", "number", [null]);
    const cpp_get_path_ptr = Module.cwrap('cpp_get_path_ptr', "number", [null]);
    const cpp_get_path_len = Module.cwrap('cpp_get_path_len', "number", [null]);
    const cpp_set_path_len = Module.cwrap('cpp_set_path_len', null, ["number"]);
    const cpp_get_board = Module.cwrap('cpp_get_board', "number", [null]);
    const cpp_update_actions = Module.cwrap("cpp_update_actions", null, [null]);
    // check if the move is valid
    valid_actions = getActions();
    // valid_actions = []
    // load the next move to the stack
    let flag = false;
    console.log(valid_actions)
    valid_actions.forEach(a =>{
        console.log(a.y, a.x);
        if(a.x == nextMove.x && a.y == nextMove.y) flag = true;
    })
    if(!flag) return -1;

    const path_ptr = cpp_get_path_ptr();
    const path_len = cpp_get_path_len();
    Module.setValue(path_ptr+path_len*4, nextMove.x + (nextMove.y << 8), 'i32');
    cpp_set_path_len(path_len+1);
    const ret = cpp_run();
    cpp_update_actions();
    console.log(ret)
    const board_ptr = cpp_get_board();
    const board = []
    for(let i = 0; i < 8; i++){
        const temp = []
        for (let j =0; j < 8; j++){
            const n = Module.getValue(board_ptr + (i*8+j) * 4, 'i32');  
            // console.log(n);  
            temp.push(n);
        }
        board.push(temp)
    }
    console.log(board);
    return {
        x: ret & 0xff, // lower 8 bits
        y: ret >> 8, // upper 8 bits
    };
}


function getActions() {
    const cpp_update_actions = Module.cwrap("cpp_update_actions", null, [null]);
    const cpp_get_actions_ptr = Module.cwrap("cpp_get_actions_ptr", "number", [
        null,
    ]);
    const cpp_get_actions_len = Module.cwrap("cpp_get_actions_len", "number", [
        null,
    ]);
    cpp_update_actions();
    const action_len = cpp_get_actions_len();
    const action_ptr = cpp_get_actions_ptr();

    const retArr = [];
    for (let i = 0; i < action_len; i++) {
        const n = Module.getValue(action_ptr + i * 4, 'i32');    
        console.log(`y:${n >> 8}, x:${n & 0xff}`);

        retArr.push({
            x: n & 0xff,
            y: n >> 8,
        });
    }
    return retArr;
}
