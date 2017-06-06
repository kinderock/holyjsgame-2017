const WALL = 1;
const FLOOR = 0;

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
    const valid = (a,b) => a < CELL_WIDTH && a >= 0 && b < CELL_HEIGHT && b >= 0;
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
    for (let y = 0; y < CELL_HEIGHT; y++) {
        let str = '';
        for (let x = 0; x < CELL_WIDTH; x++) {
            str += elems[x][y] ? '\x1b[40m\x1b[30m__' : '\x1b[47m\x1b[37m__';
        }
        console.log(str);
    }
    console.log('\x1b[40m\x1b[30m__' : '\x1b[47m__')

    return elems;
};