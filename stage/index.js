const runStrategy = require('./runStrategy');
const generateMaze = require('./generateMaze');

const strategies = {
    mine: require('./strategies/mine')
};

const mazes = [];

mazes.push(generateMaze(61, 25));
// mazes.push(generateMaze(500, 500));
// mazes.push(generateMaze(1000, 1000));

Object.keys(strategies).forEach(name => {
    mazes.forEach(maze => {
        console.log(runStrategy(strategies[name].exit, maze, true), runStrategy(strategies[name].coins, maze, false))
    })
});


