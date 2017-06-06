module.exports.exit = (() => {
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
        const finalCommands = [];

        resultPath.reduce(([pX, pY], [nX, nY]) => {
            if (pX !== nX) {
                if(nX > pX) {
                    finalCommands.push('right')
                } else {
                    finalCommands.push('left');
                }
            } else {
                if(nY > pY) {
                    finalCommands.push('down')
                } else {
                    finalCommands.push('up');
                }
            }
            return [nX, nY];
        }, resultPath.shift());

        return finalCommands;
    }

    let fPath = null;

    function strategy(move, canMove, x, y, maze) {
        if (!fPath) {
            fPath = computeShortestPath(0, 0, maze.length-1, maze[0].length-1, maze);
            console.log('============================================', fPath.length);
        }
        move(fPath.shift());
    }
    return strategy;
})();

module.exports.coins = (() => {
    let edges = null;
    let maze = null;
    const VISITED = 3;
    const WALL = 1;
    const FLOOR = 0;

    const edgeKey = (pX, pY, nX, nY) => `${pX}-${pY}_${nX}-${nY}`;
    function createMinimalOstTree(maze) {
        const key = (x, y) => `${x}-${y}`;
        const isValidRange = (x, y) => x < maze.length && x >= 0 && y < maze[0].length && y >= 0;
        const isFloor = (x, y) => maze[x][y] === FLOOR;
        const width = maze.length;
        const height = maze[0].length;
        const vertices = {};
        const newEdges = {};
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const currKey = key(x, y);
                if (maze[x][y] === FLOOR) {
                    vertices[currKey] = new Set([currKey]);
                }
            }
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const currKey = key(x, y);
                if (maze[x][y] !== WALL) {
                    let variations = [
                        [x, y + 1],
                        [x, y - 1],
                        [x + 1, y],
                        [x - 1, y],
                    ];

                    variations = variations.filter(([nX, nY]) => isValidRange(nX, nY) && isFloor(nX, nY));
                    variations.forEach(([nX, nY]) => {
                        const fromSet = vertices[currKey];
                        const toSet = vertices[key(nX, nY)];
                        if ( fromSet !== toSet ) {
                            newEdges[edgeKey(x, y, nX, nY)] = true;
                            newEdges[edgeKey(nX, nY, x, y)] = true;
                            const newSet = new Set([...fromSet, ...toSet]);
                            newSet.forEach(v => {
                                vertices[v] = newSet;
                            })
                        }
                    })
                }
            }
        }
        return newEdges;
    }

    const isFloor = (x, y) => maze[x][y] === FLOOR;
    const isVisited = (x, y) => maze[x][y] >= VISITED;
    const comparator = ([lX, lY], [rX, rY]) => maze[lX][lY] - maze[rX][rY];
    const translateDirection = (pX, pY, nX, nY) => {
        if (pX !== nX) {
            if(nX > pX) {
                return 'right';
            }
            return 'left';
        }
        if(nY > pY) {
            return 'down';
        }
        return 'up';
    };

    const getDirection = (x, y) => {
        let variations = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
        ];

        let resultX, resultY;
        variations = variations.filter(([nX, nY]) => edges[edgeKey(x, y, nX, nY)]);

        const firstNotVisited = variations.filter(([nX, nY]) => isFloor(nX, nY))[0];
        if (firstNotVisited) {
            [resultX, resultY] = firstNotVisited;
        } else {
            variations = variations.filter(([nX, nY]) => isVisited(nX, nY));
            variations.sort(comparator);
            if (variations.length === 1) {
                maze[x][y] = WALL;
            }
            [resultX, resultY] = variations[0];
        }

        return translateDirection(x, y, resultX, resultY);
    };

    return (move, canMove, x, y, argMaze) => {
        edges = edges || createMinimalOstTree(argMaze);
        maze = maze || argMaze;
        if(maze[x][y] >= VISITED){
            maze[x][y]++;
        } else {
            maze[x][y] = VISITED
        }

        move(getDirection(x, y));
    };
})();