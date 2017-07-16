var express 	= require('express');  
var app 		= express();  
var server 		= require('http').createServer(app);  
var io 			= require('socket.io')(server);
var cc 			= require('./chess.js');

var board = new cc.Board();

var initData = [
	['Chariot', 0, 0],
	['Horse', 0, 1],
	['Elephant', 0, 2],
	['Advisor', 0, 3],
	['General', 0, 4],
	['Advisor', 0, 5],
	['Elephant', 0, 6],
	['Horse', 0, 7],
	['Chariot', 0, 8],
	['Cannon', 2, 1],
	['Cannon', 2, 7],
	['Soldier', 3, 0],
	['Soldier', 3, 2],
	['Soldier', 3, 4],
	['Soldier', 3, 6],
	['Soldier', 3, 8]
];

var index 	= 0;
const DOWN 	= 1;
const UP 	= -1;
initData.forEach(function(piece) {
	new cc[piece[0]](piece[1], piece[2], 'black', DOWN, board, index++);
	new cc[piece[0]](9-piece[1], piece[2], 'red', UP, board, index++);
});

app.use(express.static(__dirname + '/bower_components'));  
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

app.post('/move/:index/:top-:left', function (req, res) { 
	var pieceIndex 	= parseInt(req.params.index);
	var top 		= parseInt(req.params.top);
	var left 		= parseInt(req.params.left);

	board.move(pieceIndex, top, left);

	res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(board.pieces));
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        client.emit('initData', JSON.stringify(board.pieces));
    });

});

server.listen(8080);  