const runStrategy = require('./runStrategy');
const generateMaze = require('./generateMaze');

const strategies = {
    tinkoff_strelnikov: require('./strategies/tinkoff_strelnikov'),
    nazivan: require('./strategies/nazivan'),
    tinkoff_kuzminov: require('./strategies/tinkoff_kuzminov'),
    aktivizion20: require('./strategies/aktivizion20'),
    reme3d2y: require('./strategies/reme3d2y'),
    totenraum: require('./strategies/totenraum'),
    alexey: require('./strategies/alexey')
};

const mazes = [];

mazes.push(generateMaze(61, 25, 20));

Object.keys(strategies).forEach(name => {
    let string = ('                           ' + name).slice(-20);
    mazes.forEach(maze => {
        try  {
            string += ('                      ' + runStrategy(strategies[name].exit(), maze, true)).slice(-15);
            string += ('                      ' + runStrategy(strategies[name].coins(), maze, false)).slice(-15);
            string += ' | ';
        } catch (e) {
            console.error(e);
        }

    });
    console.log(string);
});


