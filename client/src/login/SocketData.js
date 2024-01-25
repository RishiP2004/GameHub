import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketData = createContext();

export const GetSocket = () => useContext(SocketData);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setSocketId(newSocket.id);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketData.Provider value={{ socketId, socket }}>
            {children}
        </SocketData.Provider>
    );
};