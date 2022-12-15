
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
const board = [
    2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,2,2,
    2,2,2,2,3,2,2,2,
    2,2,2,0,1,3,2,2,
    2,2,3,1,0,2,2,2,
    2,2,2,3,2,2,2,2,
    2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,2,2
]
const index = d3.local(); 
// config
const width = 500;
const height = 500;
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

document.addEventListener("DOMContentLoaded", ()=>{
    const svg = d3.select("#mcts")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'white')
    const data = d3.range(BOARD_SIZE*BOARD_SIZE);

    const grid = svg.append("g").attr("transform", "translate(120,120)");
    const container = svg.append("g")
        .attr("transform", "translate(120,120)");

    const radius = 12
    const offset = boardWidth/16;

    console.log(offset)
    container.selectAll("circle")
    .data(board)
    .enter().append("circle")
    .attr('cx', function(d, i){return x(i%BOARD_SIZE)+offset;})
    .attr('cy', function(d, i){return y(Math.floor(i/BOARD_SIZE))+offset;})
    .attr('r', 12)
    .attr('fill', function(d, i){
        switch(d){
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
        switch(d){
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
        if(d === 3) return 5;
        return false
    })
    .on("click", (_, d)=>{
        if(d === 3){
            // const ret = runMcts({x: d%BOARD_SIZE, y: Math.floor(d/BOARD_SIZE)});
            // console.log(index.get(this))
            board[0] = 1
            console.log(board)
        }
    })
    .on("mouseenter", function(_, d){
        if(d == 3){
            d3.select(this)
            .attr("fill", "#69afff");
        }
    })
    .on("mouseout", function(_, d){
        if(d== 3)
        d3.select(this)
            .attr("fill", "#eff5fb");
    })


    grid.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr('x', function(d){return x(d%BOARD_SIZE);})
    .attr('y', function(d){return y(Math.floor(d/BOARD_SIZE));})
    .attr('width', boardWidth/8)
    .attr('height', boardHeight/8)
    .attr('stroke', '#ccc')
    .attr("fill", "#eff5fb")
})
