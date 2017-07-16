class Board {
	constructor() {
		this._map = {};
		this._pieces = [];
	}

	append(piece) {
		this._map[piece.index] = piece;
		this._pieces.push(piece.data)
	}

	getSideColor(top, left) {
		var result = false;
		for(var id in this._map) {
			var piece = this._map[id];
			if (piece.top == top && piece.left == left) {
				return piece.color;
			}
		};
		return false;
	}

	getPiece(index) {
		return this._map[index];
	}

	move(index, top, left) {
		var piece = this.getPiece(index);
		piece.move(top, left);
		this.update();
	}

	update() {
		this._pieces = [];
		for(var id in this._map) {
			var piece = this._map[id];
			this._pieces.push(piece.data)
		};
	}

	isInBoard(top, left) {
		return (top>=0 && top<=Board.MAX_TOP() && left>=0 && left<=Board.MAX_LEFT())
	}

	isBlank(top, left) {
		return this.getSideColor(top, left) === false;
	}

	get pieces() {return this._pieces}
	set pieces(arr) {this._pieces = arr}

	get map() {return this._map}

	static MAX_TOP() {return 9}
	static MAX_LEFT() {return 8}
	
}

class Piece {
    constructor (top, left, color, side, board, index) {
    	this._top 			= top;
    	this._left			= left;
    	this._color 		= color;
    	this._side			= side;
    	this._board 		= board;
    	this._index			= index;

    	this._direction 	= [
			[0, 1], [0, -1], [1, 0], [-1, 0]
		];

    	this._board.append(this);
    }

    get top() {return this._top}
    set top(t) {this._top = t}

    get left() {return this._left}
    set left(l) {this._left = l}

    get color() {return this._color}
    get index() {return this._index}

    get data() {
    	return {
    		'top'		: this._top,
    		'left'		: this._left,
    		'index'		: this.index,
    		'name'		: this.constructor.name, 
    		'color'		: this._color,
    		'movable'	: this.getMovable()
    	}
    }

    move (t, l) {
        this._top 		= t;
        this._left 		= l;
    }

    getMovable() {
    	//console.log(this.getAllEatable());
    	return [...this.validateMovable(this.getAllMovable()), ...this.getAllEatable()];
    }

    isRival(top, left) {
		var tmpColor = this._board.getSideColor(top, left);
    	return (tmpColor !== false && tmpColor !== this._color)
    }
    
    getAllMovable() {return []}
    getAllEatable() {return []}
    validateMovable(arr) {
    	var tmp = [];
		arr.forEach(function(item) {
			var t = item[0],
				l = item[1];

			if ((this._board.isBlank(t, l) && this._board.isInBoard(t, l)) || 
					(!this._board.isBlank(t, l) && this.isRival(t, l))) {
				console.log(item);
				tmp.push(item);
			}
		}, this);
		return tmp;
    }
    
}

class General extends  Piece {
	get abbr() {return 'G'}
}

class Advisor extends Piece {
	get abbr() {return 'A'}
}

class Elephant extends Piece {
	get abbr() {return 'E'}
}

class Horse extends Piece {
	get abbr() {return 'H'}
}

class Chariot extends Piece {
	get abbr() {return 'R'}
}

class Cannon extends Piece {
	get abbr() {return 'C'}

	getAllMovable() {
		var arr = [];
		this._direction.forEach(function(drt) {
			var t = this._top, 
				l = this._left;
			while (t>0 && t<Board.MAX_TOP() && l>0 && l<Board.MAX_LEFT()) {
				t += drt[0];
				l += drt[1];
				if (this._board.getSideColor(t, l) === false) {
					arr.push([t, l]);
				} else {
					break;
				}
			}
		}, this);
		return arr;
	}

	getAllEatable() {
		var arr = [];
		this._direction.forEach(function(drt) {
			var t = this._top, 
				l = this._left,
				c = 0;
			while (t>0 && t<Board.MAX_TOP() && l>0 && l<Board.MAX_LEFT()) {
				t += drt[0];
				l += drt[1];
				var tmpColor = this._board.getSideColor(t, l);
				if (tmpColor !== false) {
					c++;
				}
				if (this._top == 2 && this._left==1) {
					//console.log(t, l, this._board.getSideColor(t, l),this._color, c, this._board.getSideColor(t, l) !== this._color);
				}
				if (tmpColor !== false && tmpColor !== this._color && c==2) {
					//console.log(t,l);
					arr.push([t, l]);
					break;
				} 
			}
		}, this);
		return arr;
	}
}

class Soldier extends Piece {
	get abbr() {return 'S'}

	getAllMovable() {
		var arr = [];
		if ((this._top - Board.MAX_TOP()/2)*this._side <= 0) {
			arr.push([this._top + this._side, this._left]);
		} else {
			arr.push([this._top + this._side, this._left]);
			arr.push([this._top, this._left-1]);
			arr.push([this._top, this._left+1]);
		}
		return arr;
	}   
}

module.exports.Board 	= Board;
module.exports.Piece 	= Piece;
module.exports.General 	= General;
module.exports.Advisor 	= Advisor;
module.exports.Elephant = Elephant;
module.exports.Horse 	= Horse;
module.exports.Chariot 	= Chariot;
module.exports.Cannon 	= Cannon;
module.exports.Soldier 	= Soldier;