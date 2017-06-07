function creator() {
    const directions = ['left','up','right', 'down'];
    const getRandDirection = () => directions[Math.floor(Math.random() * directions.length)];

    let visited = null;
    let path = [];

    function getNextPoint(d, x, y) {
        switch (d) {
            case 'left': return [y, x - 1];
            case 'right': return [y, x + 1];
            case 'up': return [y - 1, x];
            case 'down': return [y + 1, x];
        }
    }

    function improvedCanMove(d, x, y, canMove) {
        const p = getNextPoint(d, x, y);
        if (p[0] < 0 || p[1] < 0 ) return false;
        const isVisited = visited[p[0]] && visited[p[0]][p[1]] === 1;
        return canMove(d) && !isVisited;
    }

    function getBack(x, y) {
        const prevPoint = path[path.length - 1];
        if (prevPoint[0] > y) return 'down';
        if (prevPoint[0] < y) return 'up';
        if (prevPoint[1] > x) return 'right';
        if (prevPoint[1] < x) return 'left';
    }

    function strategy(move, canMove, x, y, maze) {
        if (!visited) visited = maze.map(y => y.map(x => 0));

        let direction = directions.find(d => improvedCanMove(d, x, y, canMove));
        if (!direction) {
            direction = getBack(x, y);
            path.pop([y, x]);
        } else {
            path.push([y, x]);
        }

        visited[y][x] = 1;
        move(direction);
    }
    return strategy;
}

module.exports.coins = creator;
module.exports.exit = creator;