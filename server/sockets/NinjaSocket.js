/**
 * Handles the Ninja game socket events
 *
 * @param io
 * @param socket
 * @param generateUniqueId
 * @param generateId
 * @param randomX
 * @param randomSpeed
 * @constructor
 */
const NinjaSocket = (io, socket, generateUniqueId, generateId, randomX, randomSpeed) => {
    const games = {}; // Store all game states

    // Create a new game
    socket.on('createNinjaGame', ({ player1, player2 }, callback) => {
        const gameId = generateUniqueId(); // Unique game ID
        games[gameId] = {
            players: {
                [player1]: { handLandmarks: [], score: 0, color: 'red' },
                [player2]: { handLandmarks: [], score: 0, color: 'blue' }
            },
            fruits: [],
            bombs: []
        };

        callback(gameId); // Send back the generated gameId
    });

    // Player joins the game
    socket.on('joinGame', ({ gameId, playerId }) => {
        if (games[gameId]) {
            socket.join(gameId);
            console.log(`${playerId} joined game ${gameId}`);

            // Emit the initial game state to the player who joined
            socket.emit('gameState', games[gameId]);

            // Notify the other player in the game
            socket.to(gameId).emit('playerJoined', playerId);
        } else {
            socket.emit('error', 'Game not found');
        }
    });

    // Handle player hand updates (like hand movements or slicing actions)
    socket.on('playerUpdate', ({ gameId, playerId, handLandmarks }) => {
        if (games[gameId]) {
            games[gameId].players[playerId].handLandmarks = handLandmarks;

            // Emit the updated game state to all players in the room (gameId)
            io.to(gameId).emit('gameUpdate', games[gameId]);
        }
    });

    // Add fruit for a specific game
    socket.on('addFruit', ({ gameId }) => {
        if (games[gameId]) {
            const fruit = { id: generateId(), x: randomX(), y: 0, speed: randomSpeed(), isSliced: false };
            games[gameId].fruits.push(fruit);
            io.to(gameId).emit('fruitAdded', fruit); // Broadcast to specific game
        }
    });

    // Add bomb for a specific game
    socket.on('addBomb', ({ gameId }) => {
        if (games[gameId]) {
            const bomb = { id: generateId(), x: randomX(), y: 0, speed: randomSpeed(), isExploding: false };
            games[gameId].bombs.push(bomb);
            io.to(gameId).emit('bombAdded', bomb); // Broadcast to specific game
        }
    });

    // Handle when a player slices a fruit
    socket.on('fruitSliced', ({ gameId, playerId, fruitId }) => {
        if (games[gameId]) {
            const fruitIndex = games[gameId].fruits.findIndex(f => f.id === fruitId);
            if (fruitIndex !== -1) {
                games[gameId].fruits[fruitIndex].isSliced = true;
                games[gameId].players[playerId].score += 1; // Increase the player's score
            }

            // Update the game state for all players in the game
            io.to(gameId).emit('gameUpdate', games[gameId]);
        }
    });

    // Handle when a player triggers a bomb
    socket.on('bombTriggered', ({ gameId, bombId }) => {
        if (games[gameId]) {
            const bombIndex = games[gameId].bombs.findIndex(b => b.id === bombId);
            if (bombIndex !== -1) {
                games[gameId].bombs[bombIndex].isExploding = true;
            }

            // Update game state and emit to all players in the game
            io.to(gameId).emit('gameUpdate', games[gameId]);
        }
    });

};

export default NinjaSocket;
