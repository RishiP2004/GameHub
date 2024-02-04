import React, {useState} from "react";
import { updateWins } from "../../display/PlayerStats";
import {calculateWinner, Square} from "../GameUtils";
import {useHistory} from "react-router-dom";
import '../Board.css';

const PlayerBoard = (player1, player2, squares, onPlay) => {
    const history = useHistory()

    const handleClick = (i) => {
        const { playerTurn, setPlayerTurn } = useState();
        const nextSquares = squares.slice();
        const winner = calculateWinner(nextSquares);
        // 0 is player1, 1 is player2
        if (calculateWinner(squares) || squares[i]) return;

        if (playerTurn === 0) {
            nextSquares[i] = player1.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            nextSquares[i] = player2.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        if (winner) {
            updateWins(player1.getPointer() === 0 ? player1.getUsername() : player2.getUsername()).then(() => history.push('/'));
        }
    }

    return (
        <>
            <div className="status">{player1.getName()} Turn</div>
            <div className="board">
                {[0, 1, 2].map((row) => (
                    <div key={row} className="board-row">
                        {[0, 1, 2].map((col) => (
                            <Square
                                key={col}
                                value={squares[row * 3 + col]}
                                onSquareClick={() => handleClick(row * 3 + col)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default PlayerBoard;