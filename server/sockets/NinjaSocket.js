/**
 * Handles the Ninja game socket events
 *
 * @param io
 * @param socket
 * @param generateUniqueId
 * @constructor
 */
const NinjaSocket = (io, socket, generateUniqueId) => {
    let games = {};

    socket.on('createNinjaGame', ({ player1, player2 }, callback) => {
        const gameId = generateUniqueId();
        games[gameId] = { players: {}, fruits: [], bombs: [] };
        games[gameId].players[player1] = { handLandmarks: [], score: 0, color: 'red' };
        games[gameId].players[player2] = { handLandmarks: [], score: 0, color: 'blue' };

        callback(gameId); // Send the generated gameId back to the client
    });

    // Player joins the game
    socket.on('joinGame', ({ gameId, playerId }) => {
        socket.join(gameId);
        console.log(`${playerId} joined game ${gameId}`);
        socket.emit('gameState', games[gameId]);
        socket.to(gameId).emit('playerJoined', playerId);
    });

    // Handle player hand updates
    socket.on('playerUpdate', ({ gameId, playerId, handLandmarks }) => {
        if (games[gameId]) {
            games[gameId].players[playerId].handLandmarks = handLandmarks;
            io.to(gameId).emit('gameUpdate', games[gameId]); // Emit the updated game state to all players
        }
    });

    socket.on('updateGame', ({ gameId, gameState }) => {
        games[gameId] = gameState;
        socket.to(gameId).emit('gameUpdate', gameState); // Broadcast the updated game state
    });

    socket.on('fruitSliced', ({ gameId, fruit }) => {
        if (games[gameId]) {
            const fruitIndex = games[gameId].fruits.findIndex(f => f.id === fruit.id);
            if (fruitIndex !== -1) {
                games[gameId].fruits[fruitIndex].isSliced = true;
            }
            io.to(gameId).emit('gameUpdate', games[gameId]);
        }
    });

    socket.on('bombTriggered', ({ gameId, bomb }) => {
        if (games[gameId]) {
            const bombIndex = games[gameId].bombs.findIndex(b => b.id === bomb.id);
            if (bombIndex !== -1) {
                games[gameId].bombs[bombIndex].isExploding = true;
            }
            io.to(gameId).emit('gameUpdate', games[gameId]);
        }
    });
};

export default NinjaSocket;
