export const key = (x, y) => `${x}-${y}`;

export function computeShortestPath(startX, startY, maze) {
	const valid = (a,b) => a < maze.length && a >= 0 && b < maze[0].length && b >= 0;

	const notVisited = [];
	const distances = {};

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
		const variations = [
			[currX + 1, currY],
			[currX - 1, currY],
			[currX, currY + 1],
			[currX, currY - 1],
		];

		variations.forEach(([nX, nY]) => {
			update(currX, currY, nX, nY);
		});
	}
	return distances;
}