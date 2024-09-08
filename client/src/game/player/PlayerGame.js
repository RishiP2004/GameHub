import React, { useState } from "react";
import PlayerBoard from "./PlayerBoard";
import { useParams } from "react-router-dom";
import '../Game.css';
import { Player } from "./Player";

/**
 * Overseer of the PlayerBoard and handles
 * history, and current moves.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const PlayerGame = () => {
    const { player1, player2 } = useParams();
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    const guestMode = JSON.parse(localStorage.getItem('user')) === 0;

    // Player instances with pointers (0 = X, 1 = O)
    const player1Instance = new Player({ username: player1, pointerId: 0, isGuest: guestMode });
    const player2Instance = new Player({ username: player2, pointerId: 1, isGuest: guestMode });

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };

    return (
        <div className="game-container">
            <div className="game-board">
                <PlayerBoard
                    player1={player1Instance}
                    player2={player2Instance}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
        </div>
    );
}

export default PlayerGame;
