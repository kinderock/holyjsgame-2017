function creator() {
    const REVISIT_PENALTY = 1.5
    const DEADEND_PENALTY = 100000
    const directions = ['left', 'right', 'up', 'down']
    const visitedScore = {}
    const getNextCoords = (x, y) => ({ left: [x-1, y], right: [x+1, y], up: [x, y-1], down: [x, y+1] })
    const getScore = (x, y) => visitedScore[`${x}:${y}`] || 0
    const increaseScore = (x, y, n = 1) => visitedScore[`${x}:${y}`] = getScore(x, y) * REVISIT_PENALTY + n

    function strategy(move, canMove, x, y, maze) {
        const nextCoords = getNextCoords(x, y)
        const availableDirections = directions
            .sort(() => .5 - Math.random()) // ВАЖНО: рандомизуем исходный список
            .filter(canMove)
            .filter(dir => getScore(...nextCoords[dir]) < DEADEND_PENALTY) // отсекаем посещённые тупики
            .sort((a, b) => getScore(...nextCoords[a]) - getScore(...nextCoords[b]))

        increaseScore(x, y, availableDirections.length === 1 ? DEADEND_PENALTY : 1)
        move(availableDirections[0])
    }

    return strategy;
}

module.exports.exit = creator;
module.exports.coins = creator;