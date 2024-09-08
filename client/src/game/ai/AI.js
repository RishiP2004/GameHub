import OpenAI from 'openai';
import { calculateWinner } from "../GameUtils";

const API_KEY = "API_KEY";

/**
 * Calculates the best AI move based on
 * OpenAI's calculated response and
 * completes the move accordingly.
 *
 * @param squares
 * @param selectedPointer
 * @param onPlay
 * @returns {Promise<void>}
 */
async function getAIMove(squares, selectedPointer, onPlay) {
    if (calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    const newPointer = selectedPointer === 0 ? 'O' : 'X';

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

        const aiMove = parseInt(response.data.choices[0].message.content.trim());

        nextSquares[aiMove] = newPointer;

        onPlay(nextSquares);
    } catch (error) {
        console.error('Error making OpenAI API request:', error);
    }
}

export default getAIMove;
