/**
 * Handles the TicTacToe game sockets
 *
 * @param io
 * @param socket
 * @param generateUniqueId
 * @constructor
 */
const TicTacToeSocket = (io, socket, generateUniqueId) => {
    const games = {}; // Define the games object to keep track of game states

    socket.on('createGame', ({ player1, player2 }, callback) => {
        const gameId = generateUniqueId();
        socket.join(gameId);
        games[gameId] = { squares: Array(9).fill(null), players: { player1, player2 } }; // Initialize game state
        callback(gameId);
    });
    socket.on('joinGame', ({ gameId, playerId }) => {
        socket.join(gameId);  // The player joins the game's room
        console.log(`${playerId} joined game ${gameId}`);

        socket.emit('gameState', games[gameId]);
        socket.to(gameId).emit('playerJoined', playerId);
    });
    socket.on('updateGame', ({ gameId, gameState }) => {
        games[gameId] = gameState;
        socket.to(gameId).emit('gameUpdate', gameState);
    });
    socket.on('playerMove', ({ gameId, nextSquares }) => {
        const game = games[gameId];
        const currentTurn = game.currentTurn;

        if (socket.id !== game.players[currentTurn]) {
            socket.emit('invalidMove', { error: 'Not your turn' });
        } else {
            game.squares = nextSquares;
            game.currentTurn = game.currentTurn === 'player1' ? 'player2' : 'player1';
            socket.to(gameId).emit('gameUpdate', game);
            game.lastUpdated = Date.now(); // Update timestamp
        }
    });
    socket.on('disconnect', () => {
        const gameId = Object.keys(games).find(gameId =>
            games[gameId].players.player1 === socket.id ||
            games[gameId].players.player2 === socket.id
        );

        if (gameId) {
            const player = games[gameId].players.player1 === socket.id ? 'player1' : 'player2';
            socket.to(gameId).emit('playerDisconnected', { player });
            delete games[gameId]; // Clean up game resources
        }
    });
};

export default TicTacToeSocket;
