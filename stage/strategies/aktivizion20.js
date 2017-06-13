module.exports.coins = () => {
    // Для режима COINS
    const COLUMNS = 61;
    const ROWS = 25;

    let MAZE_NODES = null;
    let MAZE_CHECKED = null;
    let PATHS = null;

    function findNextPoint(x, y, maze) {
        let next_x = null;
        let next_y = null;
        (function (){
            for (let x = 0; x < maze.length; x++){
                for (let y = 0; y < maze[x].length; y++) {
                    if (maze[x][y] == 1) continue;

                    if (MAZE_CHECKED[x][y] != 1) {
                        //break dance;
                        next_x = x;
                        next_y = y;
                        return;
                    }
                }
            }
        })();
        return { x: next_x, y: next_y};
    }

    function strategy(move, canMove, x, y, maze) {
        let nextNode = null;
        if (MAZE_CHECKED == null) {
            MAZE_CHECKED = maze.map((arr) => arr.slice());
            MAZE_CHECKED[0][0] = 1;
        }
        if (MAZE_NODES == null) {
            MAZE_NODES = maze.map((row, index_row) => {
                return row.map((column, index_column) => {
                    return new Node(index_row, index_column, column);
                })

            });
        }

        let nextCoord = findNextPoint(x, y, maze);
        if (nextCoord) {
            let pathToCoord = pathFind(x, y, nextCoord.x, nextCoord.y);
            pathToCoord.pop();
            nextNode = pathToCoord.pop();
            MAZE_CHECKED[nextNode.x][nextNode.y] = 1;
        }

        function getDirection(x, y, nextNode) {
            let x_vector = nextNode.x - x;
            let y_vector = nextNode.y - y;

            if (x_vector == 1) {
                return 'right';
            } else if (x_vector == -1) {
                return 'left';
            } else if (y_vector == 1) {
                return 'down';
            } else if (y_vector == -1) {
                return 'up';
            }
        }

        if (nextNode) {
            move(getDirection(x, y, nextNode));
        }

    }


    Array.prototype.insertSorted = function(v, sortFn) {
        if (this.length < 1 || sortFn(v, this[this.length - 1]) >= 0) {
            this.push(v);
            return this;
        }
        for (var i = this.length - 2; i >= 0; --i) {
            if (sortFn(v, this[i]) >= 0) {
                this.splice(i + 1, 0, v);
                return this;
            }
        }
        this.splice(0, 0, v);
        return this;
    }


    function Node(x, y, t) {
        this.x = x;
        this.y = y;
        this.solid = t;
        this.coord = x + ":" + y;
        this.neighbours = function(goal) {
            var n = [];

            var dir = [
                [0, 1],
                [0, -1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1]
            ];
            for (var i = 0; i < 4; ++i) {
                if (this.x + dir[i][0] < 0 || this.x + dir[i][0] > COLUMNS - 1) continue;
                if (this.y + dir[i][1] < 0 || this.y + dir[i][1] > ROWS - 1) continue;

                var p = MAZE_NODES[this.x + dir[i][0]][this.y + dir[i][1]];

                if (p.solid && p != goal) continue;

                n.push(p);
            }
            return n;
        }
    }

    function h(a, b) {
        var cross = 0;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + cross * 0.001;
    }

    function pathFind(x, y, x2, y2) {
        var start = MAZE_NODES[x][y];
        var goal = MAZE_NODES[x2][y2];
        var counter = 0;

        var closed = {};
        var open = [start];

        var g_score = {};
        var f_score = {};

        g_score[start.coord] = 0;
        f_score[start.coord] = h(start, goal);

        var cameFrom = {};

        var sortFn = (b, a) => f_score[a.coord] - f_score[b.coord];

        while (open.length > 0) {
            counter++;
            var node = open.pop();
            if (node == goal) {
                var path = [goal];
                while (cameFrom[path[path.length - 1].coord]) {
                    path.push(cameFrom[path[path.length - 1].coord])
                }
                return path;
            }
            closed[node.coord] = true;

            var neighbours = node.neighbours(goal);
            for (var i = 0, c = neighbours.length; i < c; ++i) {
                var next = neighbours[i];
                if (closed[next.coord]) continue;

                var diagonal = next.x != node.x && next.y != node.y;

                var temp_g_score = g_score[node.coord] + 1;
                var isBetter = false;

                var idx = open.indexOf(next);
                if (idx < 0) {
                    isBetter = true;
                } else if (temp_g_score < g_score[next.coord]) {
                    open.splice(idx, 1);
                    isBetter = true;
                }

                if (isBetter) {
                    cameFrom[next.coord] = node;
                    g_score[next.coord] = temp_g_score;
                    f_score[next.coord] = g_score[next.coord] + h(next, goal);

                    open.insertSorted(next, sortFn);
                }
            }
        }

        return [];
    }
    return strategy;
};

module.exports.exit = () => {
    // Для режима EXIT
    const COLUMNS = 61;
    const ROWS = 25;

    let MAZE_NODES = null;
    let PATHS = null;

    function strategy(move, canMove, x, y, maze) {
        let nextNode = null;
        if (PATHS == null) {
            MAZE_NODES = maze.map((row, index_row) => {
                return row.map((column, index_column) => {
                    return new Node(index_row, index_column, column);
                })

            });
            PATHS = pathFind(0, 0, COLUMNS - 1, ROWS - 1);
            PATHS.pop(); // remove start point node
            nextNode = PATHS.pop();
        } else {
            nextNode = PATHS.pop();
        }

        function getDirection(x, y, nextNode) {
            let x_vector = nextNode.x - x;
            let y_vector = nextNode.y - y;

            if (x_vector == 1) {
                return 'right';
            } else if (x_vector == -1) {
                return 'left';
            } else if (y_vector == 1) {
                return 'down';
            } else if (y_vector == -1) {
                return 'up';
            }
        }

        if (nextNode) {
            move(getDirection(x, y, nextNode));
        }

    }


    Array.prototype.insertSorted = function(v, sortFn) {
        if (this.length < 1 || sortFn(v, this[this.length - 1]) >= 0) {
            this.push(v);
            return this;
        }
        for (var i = this.length - 2; i >= 0; --i) {
            if (sortFn(v, this[i]) >= 0) {
                this.splice(i + 1, 0, v);
                return this;
            }
        }
        this.splice(0, 0, v);
        return this;
    }


    function Node(x, y, t) {
        this.x = x;
        this.y = y;
        this.solid = t;
        this.coord = x + ":" + y;
        this.neighbours = function(goal) {
            var n = [];

            var dir = [
                [0, 1],
                [0, -1],
                [1, 0],
                [-1, 0],
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1]
            ];
            for (var i = 0; i < 4; ++i) {
                if (this.x + dir[i][0] < 0 || this.x + dir[i][0] > COLUMNS - 1) continue;
                if (this.y + dir[i][1] < 0 || this.y + dir[i][1] > ROWS - 1) continue;

                var p = MAZE_NODES[this.x + dir[i][0]][this.y + dir[i][1]];

                if (p.solid && p != goal) continue;

                n.push(p);
            }
            return n;
        }
    }

    function h(a, b) {
        var cross = 0;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + cross * 0.001;
    }

    function pathFind(x, y, x2, y2) {
        var start = MAZE_NODES[x][y];
        var goal = MAZE_NODES[x2][y2];
        var counter = 0;

        var closed = {};
        var open = [start];

        var g_score = {};
        var f_score = {};

        g_score[start.coord] = 0;
        f_score[start.coord] = h(start, goal);

        var cameFrom = {};

        var sortFn = (b, a) => f_score[a.coord] - f_score[b.coord];

        while (open.length > 0) {
            counter++;
            var node = open.pop();
            if (node == goal) {
                var path = [goal];
                while (cameFrom[path[path.length - 1].coord]) {
                    path.push(cameFrom[path[path.length - 1].coord])
                }
                return path;
            }
            closed[node.coord] = true;

            var neighbours = node.neighbours(goal);
            for (var i = 0, c = neighbours.length; i < c; ++i) {
                var next = neighbours[i];
                if (closed[next.coord]) continue;

                var diagonal = next.x != node.x && next.y != node.y;

                var temp_g_score = g_score[node.coord] + 1;
                var isBetter = false;

                var idx = open.indexOf(next);
                if (idx < 0) {
                    isBetter = true;
                } else if (temp_g_score < g_score[next.coord]) {
                    open.splice(idx, 1);
                    isBetter = true;
                }

                if (isBetter) {
                    cameFrom[next.coord] = node;
                    g_score[next.coord] = temp_g_score;
                    f_score[next.coord] = g_score[next.coord] + h(next, goal);

                    open.insertSorted(next, sortFn);
                }
            }
        }

        return [];
    }

    return strategy;
};