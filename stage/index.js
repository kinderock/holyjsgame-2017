const runStrategy = require('./runStrategy');
const generateMaze = require('./generateMaze');

const strategies = {
    // mine: require('./strategies/mine'),
    nazivan: require('./strategies/nazivan'),
    kuzminov: require('./strategies/kuzminov'),
    // aktivizion20: require('./strategies/aktivizion20'),
    reme3d2y: require('./strategies/reme3d2y'),
    totenraum: require('./strategies/totenraum'),
    alexey: require('./strategies/alexey')
};

const mazes = [];

mazes.push(generateMaze(501, 501, 20000));
// mazes.push(generateMaze(101, 101, 4000));
// mazes.push(generateMaze(101, 101, 1000));

// mazes.push(generateMaze(500, 500, 1000));
// mazes.push(generateMaze(1000, 1000, 10000));

Object.keys(strategies).forEach(name => {
    let string = ('          ' + name).slice(-12);
    mazes.forEach(maze => {
        try  {
            //console.log('=========')
            // string += ('                      ' + runStrategy(strategies[name].exit(), maze, true)).slice(-15);
            string += ('                      ' + runStrategy(strategies[name].coins(), maze, false)).slice(-15);
            string += ' | ';
        } catch (e) {
            console.error(e);
        }

    });
    console.log(string);
});


