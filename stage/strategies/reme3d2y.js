function creator() {
    const directions = ['left', 'right', 'up', 'down'];
    const pathStack = [];
    const visits = {};


    function makeVisited(x, y) {
        if (!visits[x]) visits[x] = {};
        visits[x][y] = true;
    }

    function isAlreadyVisited(x, y) {
        return (visits[x] && visits[x][y]);
    }

    function unvisitedDirections(canMove, currentX, currentY) {
        return directions
            .filter(direction => {
                const [x, y] = moveCoordsByDirection(currentX, currentY, direction);
                return canMove(direction) && !isAlreadyVisited(x, y);
            });
    }

    function coordToDirection(x, y, newX, newY) {
        let direction;
        if (x === newX) direction = newY >= y ? 'down' : 'up';
        if (y === newY) direction = newX >= x ? 'right' : 'left';
        return direction;
    }

    function moveCoordsByDirection(x, y, direction) {
        if (direction === 'up') return [x, y - 1];
        if (direction === 'down') return [x, y + 1];
        if (direction === 'left') return [x - 1, y];
        if (direction === 'right') return [x + 1, y];
    }

    function chooseDirection(unvisited) {
        return unvisited.sort((a, b) => directions.indexOf(a) >= directions.indexOf(b))[0];
    }

    function strategy(move, canMove, x, y, maze) {
        const unvisited = unvisitedDirections(canMove, x, y);

        if (unvisited.length) {
            pathStack.push([x, y]);

            const direction = chooseDirection(unvisited);
            const [nextX, nextY] = moveCoordsByDirection(x, y, direction);

            move(direction);
            makeVisited(nextX, nextY);
        } else if (pathStack.length) {
            const [newX, newY] = pathStack.pop();
            move(coordToDirection(x, y, newX, newY));
        }
    }

    return strategy;
}

module.exports.coins = creator;
module.exports.exit = creator;