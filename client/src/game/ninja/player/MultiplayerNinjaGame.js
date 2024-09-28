import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from "react-router-dom";
import io from 'socket.io-client';
import NinjaGame from './NinjaGame';
import { NinjaPlayer } from "./NinjaPlayer";

// Initialize the socket connection
const socket = io('http://localhost:4000');

const MultiplayerNinjaGame = () => {
    const { player1, player2 } = useParams();
    const history = useHistory();

    const [gameState, setGameState] = useState({});
    const [gameId, setGameId] = useState(null);

    // Memoize player instances
    const player1Instance = new NinjaPlayer({ username: player1, color: 'red' });
    const player2Instance = new NinjaPlayer({ username: player2, color: 'blue' });

    const cleanupSocket = () => {
        socket.off("gameUpdate");
        socket.disconnect();
    };

    const handleGameEnd = () => {
        cleanupSocket();
        history.push('/');
    };

    const onBack = () => {
        handleGameEnd();
    };

    useEffect(() => {
        // Create a new game and set the game ID
        socket.emit('createNinjaGame', { player1, player2 }, (generatedGameId) => {
            setGameId(generatedGameId);
            // Emit joinGame event after game is created
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player1 });
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player2 });
        });

        // Listen for game updates from the server
        socket.on('gameUpdate', (updatedGameState) => {
            setGameState(updatedGameState);
        });

        return () => {
            cleanupSocket();
        };
    }, [player1, player2]);

    // Regularly update player hand landmarks
    const handlePlayerHandUpdate = (handLandmarks) => {
        if (gameId) {
            socket.emit('playerUpdate', { gameId, playerId: player1, handLandmarks });
            socket.emit('playerUpdate', { gameId, playerId: player2, handLandmarks });
        }
    };

    const handleFruitSliced = (fruit) => {
        if (gameId) {
            socket.emit('fruitSliced', { gameId, fruit });
        }
    };

    const handleBombTriggered = (bomb) => {
        if (gameId) {
            socket.emit('bombTriggered', { gameId, bomb });
        }
    };

    return (
        <NinjaGame
            handleFruitSliced={handleFruitSliced}
            handleBombTriggered={handleBombTriggered}
            gameState={gameState}
            onBack={onBack}
            handlePlayerHandUpdate={handlePlayerHandUpdate}
        />
    );
};

export default MultiplayerNinjaGame;
