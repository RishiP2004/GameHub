import React from 'react';
import './Square.css';
/**
 * Square instance of the board used
 * for TicTacToe Boards
 *
 * @param value
 * @param onSquareClick
 * @returns {JSX.Element}
 * @constructor
 */
const Square = ({ value, onSquareClick }) => {
    return (
        <button className="square" onClick={onSquareClick}>{value}</button>
    );
};

export default Square
