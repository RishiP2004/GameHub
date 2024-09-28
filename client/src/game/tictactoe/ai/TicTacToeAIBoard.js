import React, { useState, useEffect } from 'react';
import { calculateWinner } from '../GameUtils';
import { getAIMove } from './TicTacToeAI';
import TicTacToeBoard from "../TicTacToeBoard";

/**
 * Board component for AI TicTacToe Game
 *
 * @param selectedPointer
 * @param squares
 * @param onPlay
 * @param onGameEnd
 * @returns {Element}
 * @constructor
 */
const TicTacToeAIBoard = ({ selectedPointer, squares, onPlay, onGameEnd }) => {
    const [playerTurn, setPlayerTurn] = useState(0);
    const [status, setStatus] = useState('Select Pointer');

    useEffect(() => {
        if (selectedPointer !== null) {
            setStatus(playerTurn === selectedPointer ? 'Your Turn' : 'AI Turn');
        }
    }, [selectedPointer, playerTurn]);

    const handleClick = async (i) => {
        if (selectedPointer == null || squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = selectedPointer === 0 ? 'X' : 'O';
        onPlay(nextSquares);

        const winner = calculateWinner(nextSquares);

        if (!winner) {
            await getAIMove(nextSquares, selectedPointer, onPlay);
        }

        const newWinner = calculateWinner(nextSquares);

        if (!newWinner && nextSquares.every((square) => square !== null)) {
            setStatus('Draw!');
            onGameEnd();
            return;
        }
        if (newWinner) {
            const isPlayerWinner = newWinner === selectedPointer;
            setStatus(isPlayerWinner ? 'Winner: Player' : 'Winner: AI');
            onGameEnd();
        } else {
            setPlayerTurn((prevPlayerTurn) => 1 - prevPlayerTurn);
        }
    };

    return <TicTacToeBoard squares={squares} status={status} onSquareClick={handleClick} />;
};

export default TicTacToeAIBoard;
