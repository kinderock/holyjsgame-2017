const WALL = 1;
const FLOOR = 0;
const c = require('colors/safe');

function computeShortestPath(startX, startY, finalX, finalY, maze) {
    const valid = (a,b) => a < maze.length && a >= 0 && b < maze[0].length && b >= 0;
    const key = (x, y) => `${x}-${y}`;
    const paths = {};
    const notVisited = [];
    const distances = {};

    paths[key(startX,startY)] = [[startX,startY]];

    for (let x = 0; x < maze.length; x++) {
        for (let y = 0; y < maze[0].length; y++) {
            distances[key(x,y)] = Infinity;
            notVisited.push([x,y])
        }
    }
    distances[key(startX,startY)] = 0;

    function update(currX, currY, nextX, nextY) {
        if (!valid(currX, currY) || !valid(nextX, nextY)) {
            return
        }

        const currentDistance = !maze[currX][currY] && !maze[nextX][nextY] ? 1 : Infinity;
        if (distances[key(nextX, nextY)] > currentDistance + distances[key(currX, currY)]) {
            // console.log(currX, currY, nextX, nextY);
            paths[key(nextX, nextY)] = paths[key(currX, currY)].concat([[nextX, nextY]]);
            distances[key(nextX, nextY)] = distances[key(currX, currY)] + currentDistance;
        }
    }

    while(notVisited.length) {
        notVisited.sort(
            (
                [x1, y1],
                [x2, y2]
            ) => distances[key(x1,y1)] - distances[key(x2, y2)] || 0
        );
        const [currX, currY] = notVisited.shift();
        update(currX, currY, currX + 1, currY);
        update(currX, currY, currX - 1, currY);
        update(currX, currY, currX, currY + 1);
        update(currX, currY, currX, currY - 1);
    }
    // console.log(key(finalX, finalY), paths);
    const resultPath = paths[key(finalX, finalY)];
    return resultPath;
}

const nearFloorCount = (x, y, maze) => {
    let result = 0;
    if (maze[x] && maze[x][y + 1] === FLOOR) result++;
    if (maze[x] && maze[x][y - 1] === FLOOR) result++;
    if (maze[x + 1] && maze[x + 1][y] === FLOOR) result++;
    if (maze[x - 1] && maze[x - 1][y] === FLOOR) result++;
    return result;
};

module.exports = function getMaze(CELL_WIDTH, CELL_HEIGHT, RANDOM_CELL_COUNT = 20) {
    const walls = [];
    const valid = (a, b) => a < CELL_WIDTH && a >= 0 && b < CELL_HEIGHT && b >= 0;
    let elems = [];

    for (let x = 0; x < CELL_WIDTH; x++) {
        elems[x] = [];
        for (let y = 0; y < CELL_HEIGHT; y++) {
            elems[x][y] = WALL;
        }
    }

    function amaze(x, y, addBlockWalls) {
        elems[x][y] = FLOOR;
        if (addBlockWalls) {
            if (valid(x, y + 1) && elems[x][y + 1] === WALL) walls.push([x, y + 1, [x, y]]);
            if (valid(x, y - 1) && elems[x][y - 1] === WALL) walls.push([x, y - 1, [x, y]]);
            if (valid(x + 1, y) && elems[x + 1][y] === WALL) walls.push([x + 1, y, [x, y]]);
            if (valid(x - 1, y) && elems[x - 1][y] === WALL) walls.push([x - 1, y, [x, y]]);
        }
    }

    amaze(0, 0, true);

    while (walls.length) {
        let randomWall = walls[Math.floor(Math.random() * walls.length)];
        let host = randomWall[2];
        let opposite = [
            (host[0] + (randomWall[0] - host[0]) * 2),
            (host[1] + (randomWall[1] - host[1]) * 2)
        ];

        if (valid(opposite[0], opposite[1])) {
            if (elems[opposite[0]][opposite[1]] === FLOOR)
                walls.splice(walls.indexOf(randomWall), 1);
            else {
                amaze(randomWall[0], randomWall[1], false);
                amaze(opposite[0], opposite[1], true);
            }
        } else {
            walls.splice(walls.indexOf(randomWall), 1);
        }
    }

    let randomCells = 0;

    while (randomCells < RANDOM_CELL_COUNT) {
        let randX = 1 + Math.floor(Math.random() * CELL_WIDTH - 2);
        let randY = 1 + Math.floor(Math.random() * CELL_HEIGHT - 2);
        if (elems[randX] && elems[randX][randY] === WALL && nearFloorCount(randX, randY, elems) === 2) {
            elems[randX][randY] = FLOOR;
            randomCells++;
        }
    }
    const accum = {};
    // const path = computeShortestPath(0, 0, CELL_WIDTH-1, CELL_HEIGHT-1, elems);
    // const accum = path.reduce((accum, [x, y]) => {
    //     accum[`${x}-${y}`] = true;
    //     return accum;
    // }, {});

    for (let y = 0; y < CELL_HEIGHT; y++) {
        let str = '';
        for (let x = 0; x < CELL_WIDTH; x++) {
            str += elems[x][y] ? c.bgBlack('  ') : (accum[`${x}-${y}`] ? c.bgRed('  ') : c.bgWhite('  '));
        }
        console.log(str);
    }
    console.log(c.bgBlack(''));

    console.log('generated');
    return elems;
};