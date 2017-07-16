var Board = {

	sizePiece: 50,
	sizeSquare: 62,
	tempMovable: [],

	init: function(pieces, el, socket) {
		this.el 	= el;
		this.socket = socket;
		this.map 	= {};

		pieces.forEach(function(piece) {
			this.map[piece.index] = this.createPiece(piece);
		}, this);

	},

	createPiece: function(data) {
		var piece = document.createElement('img');
		var pos = this.getPiecePosition(data.top, data.left);
		piece.id = 'piece-' + data.index;
		piece.className = 'piece';
		piece.src = '/img/' + data.name + '_' + data.color + '.png';
		piece.style.top = pos.top + 'px';
		piece.style.left = pos.left + 'px';
		piece.style.width = this.sizePiece + 'px';
		$.data(piece, 'data', data);
		
		this.el.appendChild(piece);
		
		this.attachDragEvent($(piece));

		return piece;
	},

	updatePiece: function(data) {
		var piece = document.getElementById('piece-'+data.index);
		var pos = this.getPiecePosition(data.top, data.left);
		piece.style.top = pos.top + 'px';
		piece.style.left = pos.left + 'px';
		$.data(piece, 'data', data);
	},

	createDroppable : function(i, j) {
		var piece = document.createElement('img');
		var pos = this.getPiecePosition(i, j);
		piece.className = 'droppable';
		piece.src = '/img/droppable.png';
		piece.style.top = pos.top + 'px';
		piece.style.left = pos.left + 'px';
		piece.style.width = this.sizePiece + 'px';
		this.el.appendChild(piece);
		$.data(piece, 'pos', {'top': i, 'left': j});
		return $(piece);
	},
	attachDragEvent: function(piece) {
		var self = this;

		piece.draggable({
			revert: "invalid",

			start: function(evt, ui) {
				var data = $.data(this, 'data');
				this.style['z-index'] = 3;
				for(var i=0; i<data.movable.length; i++) {
					var movable = data.movable[i];
					var droppable = self.createDroppable(movable[0], movable[1]);
					self.attactDropEvent(droppable);
					self.tempMovable.push(droppable);
				}
			},

			stop: (function(evt, ui) {
				evt.target.style['z-index'] = 1;
				this.tempMovable.forEach(function(item) {
					item.remove();
				});
			}).bind(this)
		});
	},

	attactDropEvent: function(droppable) {
		var self = this;
		droppable.droppable({
			drop: function(evt, ui) {
				var piece = ui.draggable[0];
				var pos = $.data(this, 'pos');
				var data = $.data(piece, 'data');
				$.ajax({
					dataType: "json",
					method: "POST",
					url: "/move/" + data.index + '/' + pos.top + '-' + pos.left,
				})
				.done(function( pieces ) {
					pieces.forEach(function(piece) {
						self.updatePiece(piece);
					});
				});
			}
		});
	},

	getPiecePosition: function(top, left) {
		return {
			top: top*this.sizeSquare + this.sizePiece/2, 
			left: left*this.sizeSquare + this.sizePiece/2
		}
	}

}