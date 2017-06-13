/*
 * 1. Соберите все монетки (за минимальное число шагов)
 * 2. Найдите выход (за минимальное число шагов)
 * @move : function('left' | 'rigth' | 'up' | 'down')
 * @canMove : function('left' | 'rigth' | 'up' | 'down') => Boolean
 * @x : Number : текущая координата x
 * @y : Number : текущая координата y
 * @maze : Array(Array(0 | 1)) : двумерный массив, описывающий весь лабиринт, 0 - проход, 1 - стена
 */
function creator() {
    const directions = ['right', 'left', 'up', 'down'];
    const nflag = 10000;
    const mflag = 100;
    const cache = {};
    const getWas = (x, y) => ({
        down: cache[(x) + '-' + (y + 1)],
        left: cache[(x - 1) + '-' + (y)],
        right: cache[(x + 1) + '-' + (y)],
        up: cache[(x) + '-' + (y - 1)]
    });
    let direction;
    let flag = 1;

    function strategy(move, canMove, x, y) {
        const position = x + '-' + y;
        cache[position] = (cache[position] || 1);
        const was = getWas(x, y);
        let path = 0;
        let newpath = 0;
        let mm = 0;
        let nmin = Infinity;
        let dir;
        let mdir;
        let ndir;

        for (const side of directions) {
            if (canMove(side)) {
                path++;
                dir = dir || side;
                if (!was[side]) {
                    newpath++;
                    mm += was[side];
                    mdir = mdir || side;
                } else {
                    nmin = was[side] < nmin ? (ndir = side, was[side]) : nmin;
                }
            }
        }

        if (newpath) {
            flag = path > 2 ? 1 : path > 1 ? mflag : nflag;
            direction = mdir;
        } else if (path === 1) {
            flag = nflag;
            direction = dir;
        } else {
            flag = path > 2
                ? (mm >= nflag * path ? nflag : mflag)
                : (mm >= nflag ? nflag : flag);
            direction = ndir;
        }

        cache[position] += flag;
        move(direction);
    }

    return strategy;
}

module.exports.exit = creator;
module.exports.coins = creator;

