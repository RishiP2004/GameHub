import React from 'react';
import './Square.css';

/**
 * Square instance of the board used
 * for TicTacToePlayerBoard and TicTacToeAIBoard
 *
 * @param value
 * @param onSquareClick
 * @returns {JSX.Element}
 * @constructor
 */
export const Square = ({ value, onSquareClick }) => {
    return (
        <button className="square" onClick={onSquareClick}>{value}</button>
    );
};
