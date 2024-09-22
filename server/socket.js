import { Server } from 'socket.io';
import crypto from 'crypto';

export default (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });

    io.on('connection', (socket) => {
        socket.on('createGame', ({ player1, player2 }, callback) => {
            const gameId = crypto.randomBytes(4).toString('hex');
            socket.join(gameId);
            callback(gameId);
        });

        socket.on('playerMove', ({ gameId, nextSquares }) => {
            socket.to(gameId).emit('gameUpdate', nextSquares);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
