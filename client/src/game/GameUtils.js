import React from "react"

/**
 * Calculates the winner of the board
 * based on X or O, or null if none
 *
 * @param squares
 * @returns {null|*}
 */
export function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null;
}
/**
 * Square instance of the board used
 * for PlayerBoard and AIBoard
 *
 * @param value
 * @param onSquareClick
 * @returns {JSX.Element}
 * @constructor
 */
export function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}