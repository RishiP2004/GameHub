import axios from 'axios';
import Game from "../Game";

class AI {
    static async getMove(squares, selectedPointer, onPlay) {
        if (Game.calculateWinner(squares)) return;

        const nextSquares = squares.slice();

        let newPointer = '';

        if (selectedPointer === 0) newPointer = 'O';
        else newPointer = 'X';

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/engines/davinci/completions',
                {
                    prompt: `Given the Tic Tac Toe board ${nextSquares} and the player's symbol ${newPointer}, what is the best move?`,
                    max_tokens: 1,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
                    },
                }
            );
            const aiMove = response.data.choices[0].text.trim();

            nextSquares[aiMove] = newPointer;

            onPlay(nextSquares);
        } catch (error) {
            console.error('Error making OpenAI API request:', error);
        }
    }
}

export default AI;