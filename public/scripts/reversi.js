
// data
const BOARD_SIZE = 8;
// const board = [
//     [2,2,2,2,2,2,2,2],
//     [2,2,2,2,2,2,2,2],
//     [2,2,2,2,3,2,2,2],
//     [2,2,2,0,1,3,2,2],
//     [2,2,3,1,0,2,2,2],
//     [2,2,2,3,2,2,2,2],
//     [2,2,2,2,2,2,2,2],
//     [2,2,2,2,2,2,2,2],
// ]
let board = [
    2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,2,2,
    2,2,2,3,2,2,2,2,
    2,2,3,1,0,2,2,2,
    2,2,2,0,1,3,2,2,
    2,2,2,2,3,2,2,2,
    2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,2,2
]

const addIndex = (board) =>{
    return board.map((d, i) => ({value: d, id: i}))
}

const check = ()=>{
    let count = 0;
    board.forEach(b => {
        if(b === 0) count ++;
        if(b === 1) count --;
    })
    if(count > 0) return "🎊Looks like we have a winner!!🎊"
    if(count < 0) return "🤡LAME🤡"
    if(count === 0) return "😬DRAW😬"
    return count;
}
const index = d3.local(); 
// config
const width = 375;
const height = 375;
const boardWidth = 250;
const boardHeight = 250
// visualization

// scale band to locate the grid
const x = d3.scaleBand()
.range([0,250])
.domain(d3.range(BOARD_SIZE));
const y = d3.scaleBand()
.range([0,250])
.domain(d3.range(BOARD_SIZE));

const drawCircle = (container) => {
    const offset = boardWidth/16;
    container.selectAll("circle")
    .data(addIndex(board))
    .enter().append("circle")
    .attr('cx', function(d, i){return x(i%BOARD_SIZE)+offset;})
    .attr('cy', function(d, i){return y(Math.floor(i/BOARD_SIZE))+offset;})
    .attr('r', 12)
    .attr('fill', function(d, i){
        switch(d.value){
            case 0:
                return 'white';
            case 1:
                return '#555';
            case 2:
                return "transparent";
            default:
                return "transparent";
        }
    })
    .style('stroke', function(d){
        switch(d.value){
            case 0:
                return '#555';
            case 1:
                return '#555';
            case 2:
                return "transparent";
            case 3:
                return "#777";
        }
    })
    .style('stroke-dasharray', function(d, i){
        if(d.value === 3) return 5;
        return false
    })
    .on("click", (_, d)=>{
        if(d.value === 3){
            newBoard = runMcts({x: d.id%BOARD_SIZE, y: Math.floor(d.id/BOARD_SIZE)});
            if(newBoard.length === 0){
                alert(check(board));
                return;
            }
            board = newBoard;
            const actions = getActions();
            if(actions.length === 0){
                alert(check(board));
            }
            actions.forEach(a => {
                board[a.y*BOARD_SIZE + a.x] = 3;
            })
            container.selectAll("circle").remove()
            drawCircle(container)
        }
    })
    .on("mouseenter", function(_, d){
        if(d.value == 3){
            d3.select(this)
            .attr("fill", "#69afff");
        }
    })
    .on("mouseout", function(_, d){
        if(d.value == 3)
        d3.select(this)
            .attr("fill", "#eff5fb");
    })
}


const draw = () => {
    const svg = d3.select("#mcts")
    .append('svg')
    .attr('class', 'mcts-svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'white')


    const data = d3.range(BOARD_SIZE*BOARD_SIZE);


    

    const grid = svg.append("g").attr("transform", "translate(60,60)");
    const container = svg.append("g")
        .attr("transform", "translate(60,60)");
    drawCircle(container);
    grid.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr('x', function(d){return x(d%BOARD_SIZE);})
    .attr('y', function(d){return y(Math.floor(d/BOARD_SIZE));})
    .attr('width', boardWidth/8)
    .attr('height', boardHeight/8)
    .attr('stroke', '#ccc')
    .attr("fill", "#eff5fb")
}
document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelector("#mcts-loading").setAttribute("style", "display:none")
    draw()
})