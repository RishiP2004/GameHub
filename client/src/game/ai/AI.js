import OpenAI from 'openai';

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

		try {
			const openai = OpenAI();

			const prompt = `Given the Tic Tac Toe board ${nextSquares} and the player's symbol ${newPointer}, what is the best move?`;

			const response = await openai.ChatCompletion.create({
				model: 'davinci',
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
					{ role: 'user', content: prompt },
				],
				max_tokens: 1,
			}, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
			const aiMove = response.data.choices[0].message.content.trim();

			nextSquares[aiMove] = newPointer;

			onPlay(nextSquares);
		} catch (error) {
			console.error('Error making OpenAI API request:', error);
		}
    }
}

export default AI;