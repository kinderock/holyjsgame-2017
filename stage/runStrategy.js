const FLOOR = 0;
const WALL = 1;
c = require('colors/safe');

module.exports = function runStrategy(strategy, maze, findExit = false) {
    let allCoinsCount = -1;
    let visited = [];
    let mazeCopy = [];

    for(let x = 0; x < maze.length; x++) {
        visited[x] = [];
        mazeCopy[x] = [];
        for(let y = 0; y < maze[0].length; y++) {
            if (maze[x][y] === FLOOR) allCoinsCount++;
            mazeCopy[x][y] = maze[x][y];
            visited[x][y] = false;
        }
    }

    visited[0][0] = true;

    let currentX = 0;
    let currentY = 0;
    let coinsCount = 0;
    let stepsCount = 0;

    const canMove = name => {
        let x = currentX;
        let y = currentY;

        switch (name) {
            case 'left':
                x -= 1;
                break;
            case 'right':
                x += 1;
                break;
            case 'up':
                y -= 1;
                break;
            case 'down':
                y += 1;
                break;
        }

        return maze[x] && maze[x][y] === FLOOR;
    };

    const move = dir => {
        if (dir === undefined || !canMove(dir)) {
            process.exit(0);
        }

        if (canMove(dir))
            stepsCount++;
            switch (dir) {
                case 'left':
                    currentX--;
                    break;
                case 'right':
                    currentX++;
                    break;
                case 'up':
                    currentY--;
                    break;
                case 'down':
                    currentY++;
                    break;
            }

        if(!visited[currentX][currentY]) {
            coinsCount++;
            visited[currentX][currentY] = true;
        }
    };

    function isCompleted() {
        if (findExit) {
            //console.log(Date.now(), 'exit', currentX, currentY);
            //console.log(canMove('left'), canMove('right'), canMove('up'), canMove('down'));
            return currentX === maze.length - 1 && currentY === maze[0].length - 1;
        }
        //console.log(Date.now(), 'coins', coinsCount, allCoinsCount);
        return allCoinsCount === coinsCount;
    }

    while(!isCompleted()) {
        strategy(move, canMove, currentX, currentY, mazeCopy)
    }

    // for (let y = 0; y < maze[0].length; y++) {
    //     let str = '';
    //     for (let x = 0; x < maze.length; x++) {
    //         str += maze[x][y] ? c.bgBlack('  ') : (visited[x][y] ? c.bgRed('  ') : c.bgWhite('  '));
    //     }
    //     console.log(str);
    // }
    //console.log(c.bgBlack(''));

    return stepsCount;
};