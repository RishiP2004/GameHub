import React, { useState } from 'react';
import { calculateWinner } from '../GameUtils';
import { useHistory } from 'react-router-dom';
import { TicTacToe } from '../../GameIds';
import TicTacToeBoard from "../TicTacToeBoard";

/**
 * Board component for Player TicTacToe Game
 *
 * @param player1
 * @param player2
 * @param squares
 * @param onPlay
 * @param onGameEnd
 * @returns {Element}
 * @constructor
 */
const TicTacToePlayerBoard = ({ player1, player2, squares, onPlay, onGameEnd }) => {
    const [playerTurn, setPlayerTurn] = useState(0);
    const history = useHistory();

    const handleClick = (i) => {
        const nextSquares = squares.slice();

        if (calculateWinner(nextSquares) || squares[i]) {
            return;
        }
        if (playerTurn === 0) {
            nextSquares[i] = player1.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            nextSquares[i] = player2.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        const newWinner = calculateWinner(nextSquares);

        if (newWinner) {
            const winnerPlayer = newWinner === (player1.getPointer() === 'X' ? 0 : 1) ? player1 : player2;
            winnerPlayer.updateWins(history, TicTacToe);
            onGameEnd();
        } else if (nextSquares.every((square) => square !== null)) {
            onGameEnd();
        }
    };

    const getStatusMessage = () => {
        const winner = calculateWinner(squares);
        if (winner) {
            const winnerPlayer = winner === (player1.getPointer() === 'X' ? 'X' : 'O') ? player1 : player2;
            return `${winnerPlayer.getUsername()} Wins!`;
        } else if (squares.every((square) => square !== null)) {
            return 'Draw!';
        } else {
            return `${playerTurn === 0 ? player1.getUsername() : player2.getUsername()} Turn`;
        }
    };

    return <TicTacToeBoard squares={squares} status={getStatusMessage()} onSquareClick={handleClick} />;
};

export default TicTacToePlayerBoard;
