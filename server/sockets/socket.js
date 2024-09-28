import { Server } from 'socket.io';
import crypto from 'crypto';
import NinjaSocket from "./NinjaSocket.js";
import TicTacToeSocket from "./TicTacToeSocket.js";
/**
 * Default socket listener
 *
 * @param server
 */
export default (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:4000',
        },
    });

    const generateUniqueId = () => {
        return crypto.randomBytes(4).toString('hex');
    }

    io.on('connection', (socket) => {
        TicTacToeSocket(io, socket, generateUniqueId());
        NinjaSocket(io, socket, generateUniqueId());
    });
};
