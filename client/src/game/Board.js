import React from "react";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            selectedPointer: 0,
            playerTurn: 0,
        };
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    render() {
        return (
            <>
                <div className="status">Your Turn</div>
                <div className="board">
                    {[0, 1, 2].map((row) => (
                        <div key={row} className="board-row">
                            {[0, 1, 2].map((col) => (
                                <Square
                                    key={col}
                                    value={this.state.squares[row * 3 + col]}
                                    onSquareClick={() => this.handleClick(row * 3 + col)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default Board;