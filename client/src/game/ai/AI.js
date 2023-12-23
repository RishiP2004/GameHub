class AI {
    static calculateWinner(squares) {
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

    static getMove(squares, selectedPointer, i, onPlay) {
        if (AI.calculateWinner(squares) || squares[i]) return;

        const nextSquares = squares.slice();

        let newPointer = '';

        if (selectedPointer === 0) newPointer = 'O';
        else newPointer = 'X';

        const emptySquares = nextSquares.reduce((acc, val, idx) => {
            if (!val) acc.push(idx);
            return acc;
        }, []);

        //TODO: AI logic for move
        const aiMove = emptySquares[0];
        nextSquares[aiMove] = newPointer;

        onPlay(nextSquares);
    }
}

export default AI;