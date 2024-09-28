import React, {useState, useEffect, useCallback} from "react";
import TicTacToePlayerBoard from "./TicTacToePlayerBoard";
import { useParams, useHistory } from "react-router-dom";
import io from "socket.io-client";
import { TicTacToePlayer } from "./TicTacToePlayer";
import TicTacToeGame from "../TicTacToeGame";

// Create a connection to the server
const socket = io("http://localhost:4000");

/**
 * Manages TicTacToe Player game
 *
 * @returns {Element}
 * @constructor
 */
const TicTacToePlayerGame = () => {
    const { player1, player2 } = useParams();
    const history = useHistory();
    const [setGameState] = useState({ squares: Array(9).fill(null) });
    const [gameId, setGameId] = useState(0);

    // Player instances
    const player1Instance = new TicTacToePlayer({ username: player1, pointerId: 0 });
    const player2Instance = new TicTacToePlayer({ username: player2, pointerId: 1 });

    const handlePlay = (nextSquares) => {
        if (gameId) {
            socket.emit("playerMove", { gameId, nextSquares });
        }
    };

    const cleanupSocket = () => {
        socket.off("updateGame");
        socket.disconnect();
    };

    const handleGameEnd = useCallback(() => {
        cleanupSocket();
        history.push('/');
    }, [history]); // Include history if it's a dependency

    const onBack = () => {
        handleGameEnd();
    };

    useEffect(() => {
        let games = [];

        socket.on('createGame', ({ player1, player2 }, generatedGameId) => {
            setGameId(generatedGameId);
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player1 });
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player2 });
            games[generatedGameId] = {lastUpdated: Date.now()};

            // Set a timer to remove the game after 15 minutes of inactivity
            setTimeout(() => {
                if (Date.now() - games[generatedGameId].lastUpdated > 15 * 60 * 1000) {
                    delete games[generatedGameId];
                    handleGameEnd();
                }
            }, 15 * 60 * 1000);
        });

        socket.on("updateGame", (gameState) => {
            setGameState(gameState);
        });
        socket.on('invalidMove', ({ error }) => {
            alert(error);
        });

        socket.on('playerDisconnected', ({ player }) => {
            alert(`${player} has disconnected. The game will end.`);
            handleGameEnd();
        });

        return () => {
            cleanupSocket();
        };
    }, [player1, player2, gameId, handleGameEnd, setGameState]);

    return (
        <TicTacToeGame
            BoardComponent={TicTacToePlayerBoard}
            boardProps={{
                player1: player1Instance,
                player2: player2Instance,
                onGameEnd: handleGameEnd
            }}
            handlePlay={handlePlay}
            onBack={onBack}
        />
    );
};

export default TicTacToePlayerGame;
