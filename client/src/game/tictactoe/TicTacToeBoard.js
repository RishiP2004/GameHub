import Square from './Square';
import './Board.css';
import React from "react";
/**
 * Needed to create a self child instance
 * with certain paramaters required
 *
 * @returns {Element}
 * @constructor
 */
export const createBoardComponent = (BoardComponent, boardProps) => {
    return <BoardComponent {...boardProps} />;
};
/**
 * Parent TicTacToe Board for children
 *
 * @param squares
 * @param onSquareClick
 * @param status
 * @returns {Element}
 * @constructor
 */
const TicTacToeBoard = ({ squares, onSquareClick, status }) => {
    return (
        <div className="game-container">
            <div className="status">{status}</div>
            <div className="board">
                {[0, 1, 2].map((row) => (
                    <div key={row} className="board-row">
                        {[0, 1, 2].map((col) => (
                            <Square
                                key={col}
                                value={squares[row * 3 + col]}
                                onSquareClick={() => onSquareClick(row * 3 + col)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicTacToeBoard;
