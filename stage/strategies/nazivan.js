function creator() {
    function CO(x, y) {
        this.x = x;
        this.y = y;
    }

    function CPoint() {};

    CPoint.prototype = {
        closed: false,

        setCO: function(co) {
            this.co = co;

            this.visits = 0;
            this.exits = null;
            this.closed = false;

            return this;
        },

        getCO: function() {
            return this.co;
        },

        setPaths: function(left, right, up, down) {
            this.canMove = {
                [CPoint.DIR.LEFT]: left,
                [CPoint.DIR.RIGHT]: right,
                [CPoint.DIR.UP]: up,
                [CPoint.DIR.DOWN]: down
            };

            this.exits = 0;

            if(left) { this.exits +=1; }
            if(right) { this.exits +=1; }
            if(up) { this.exits +=1; }
            if(down) { this.exits +=1; }

            return this;
        },

        isImpasse: function() {
            return this.exits == 1;
        },

        isTonnel: function() {
            return this.exits == 2;
        },

        isCross: function() {
            return this.exits >= 3;
        },

        isClosed: function() {
            return this.closed;
        }
    };

    CPoint.DIR = {
        LEFT: 'left',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    };


    function CMap() {
        this.currentPoint = null;
    }

    CMap.prototype = {
        _map: {},

        add: function(point) {
            var x = point.co.x;
            var y = point.co.y;

            if(!this._map[x]) {
                this._map[x] = {};
            }

            this._map[x][y] = point;
        },

        get: function(x, y) {
            return this._map[x][y];
        },

        getByCo: function(co) {
            return this._map[co.x][co.y];
        },

        exist: function(co) {
            return !!(this._map[co.x] && this._map[co.x][co.y]);
        },

        getRelCo: function(co, dir) {
            var newCO = new CO();

            switch (dir) {
                case CPoint.DIR.RIGHT: newCO.x = co.x+1; newCO.y = co.y; break;
                case CPoint.DIR.LEFT:  newCO.x = co.x-1; newCO.y = co.y; break;
                case CPoint.DIR.UP:    newCO.x = co.x; newCO.y = co.y - 1; break;
                case CPoint.DIR.DOWN:  newCO.x = co.x; newCO.y = co.y + 1; break;
            }

            return newCO;
        },

        getRel: function(co, dir) {
            return this.getByCo(this.getRelCo(co, dir));
        }
    }

    function CDirFromPoint(dir) {
        this.dir = dir;

        this.can = null;
        this.was = null;
        this.point = null;
    }

    CDirFromPoint.isCanMove = function(el) { return el.can; }
    CDirFromPoint.isNotClosed = function(el) { return !el.closed; }
    CDirFromPoint.isWasntHere = function(el) { return !el.was; }

    CDirFromPoint.byPrefer = function(dirA, dirB) {
        if (dirA.was && !dirB.was) {
            return 1;
        } else if (!dirA.was && dirB.was) {
            return -1;
        } else if (dirA.was && dirB.was){
            return dirA.point.visits - dirB.point.visits;
        } else {
            return 0;
        }
    };


    CDirFromPoint.fillDirection = function(currentPoint, item) {
        item.can = currentPoint.canMove[item.dir];
        item.was = map.exist(map.getRelCo(currentPoint.co, item.dir));

        if(item.was) {
            item.point = map.getRel(currentPoint.co, item.dir);
        }

        item.closed = item.was && item.point.isClosed();
    }

    var map = new CMap();

    function strategy(move, canMove, x, y, maze) {

        let currentPoint;
        let dir;
        let currentCO = new CO(x, y);

        // get point
        if(map.exist(currentCO)) {
            currentPoint = map.get(x, y);
        } else {
            currentPoint = new CPoint().setCO(currentCO);
            currentPoint.setPaths(canMove('left'), canMove('right'), canMove('up'), canMove('down'));

            map.add(currentPoint);
        }

        currentPoint.visits++;
        // collect directons
        // Order by LEFT HAND
        let dirs = [
            new CDirFromPoint(CPoint.DIR.RIGHT),
            new CDirFromPoint(CPoint.DIR.UP),
            new CDirFromPoint(CPoint.DIR.LEFT),
            new CDirFromPoint(CPoint.DIR.DOWN),
        ];

        dirs.forEach(CDirFromPoint.fillDirection.bind(null, currentPoint));

        dirs = dirs
            .filter(CDirFromPoint.isCanMove)
            .filter(CDirFromPoint.isNotClosed)
            .sort(CDirFromPoint.byPrefer);

        if( currentPoint.isImpasse()
            || currentPoint.isCross() && dirs.length == 1
            || map.prevPoint
            && currentPoint.isTonnel() && (map.prevPoint.isImpasse() || map.prevPoint.isClosed())
        ) {
            currentPoint.closed = true;
        }

        // save && process state
        map.prevPoint = currentPoint;

        if(dirs[0]) {
            map.curDirection = dirs[0].dir;
            move(dirs[0].dir);
        }
    }

    return strategy;
}

module.exports.exit = creator;
module.exports.coins = creator;