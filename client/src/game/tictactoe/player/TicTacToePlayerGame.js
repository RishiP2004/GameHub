import React, { useState, useEffect } from "react";
import TicTacToePlayerBoard from "./TicTacToePlayerBoard";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import '../TicTacToe.css';
import { TicTacToePlayer } from "./TicTacToePlayer";

// Create a connection to the server
const socket = io("http://localhost:5000");

/**
 * Overseer of the TicTacToePlayerBoard
 * Handles history, and current moves.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const TicTacToePlayerGame = () => {
    const { player1, player2 } = useParams();
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [gameId, setGameId] = useState(null);
    const currentSquares = history[currentMove];

    // Player instances
    const player1Instance = new TicTacToePlayer({ username: player1, pointerId: 0 });
    const player2Instance = new TicTacToePlayer({ username: player2, pointerId: 1 });

    useEffect(() => {
        // Request the server to generate a unique gameId
        socket.emit("createGame", { player1, player2 }, (generatedGameId) => {
            setGameId(generatedGameId); // Save the gameId returned from the server
        });

        socket.on("gameUpdate", (nextSquares) => {
            const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
            setHistory(nextHistory);
            setCurrentMove(nextHistory.length - 1);
        });

        return () => {
            socket.off("gameUpdate");
        };
    }, [history, currentMove, player1, player2]);

    const handlePlay = (nextSquares) => {
        if (gameId) {
            // Emit the player's move with the associated gameId
            socket.emit("playerMove", { gameId, nextSquares });
        }
    };

    return (
        <div className="game-container">
            <div className="game-board">
                <TicTacToePlayerBoard
                    player1={player1Instance}
                    player2={player2Instance}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
        </div>
    );
};

export default TicTacToePlayerGame;

