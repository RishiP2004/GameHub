import OpenAI from 'openai';
import {calculateWinner} from "../GameUtils";

const API_KEY = process.env.REACT_APP_GPT_API_KEY;
const MIN_TIME_BETWEEN_MOVES = 1000;

let lastAIMoveTimestamp = 0;
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
export const getAIMove = async (squares, selectedPointer, onPlay) => {
    if (calculateWinner(squares)) return; // Exit if game is already won
    const now = Date.now();

    if (now - lastAIMoveTimestamp < MIN_TIME_BETWEEN_MOVES) {
        return; // Don't make a move if it's too soon
    }
    lastAIMoveTimestamp = now;

    const nextSquares = squares.slice();
    const aiPointer = selectedPointer === 0 ? 'O' : 'X'; // AI uses the opposite pointer

    try {
        const openai = new OpenAI({
            apiKey: API_KEY,
        });

        const prompt = `Given the Tic Tac Toe board [${nextSquares}] and the player's symbol "${aiPointer}", what is the best move (index 0-8)? Respond with a single number.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that plays Tic Tac Toe.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 1,
        });

        const aiMove = parseInt(response.choices[0].message.content.trim(), 10);

        if (!isNaN(aiMove) && nextSquares[aiMove] === null) {
            nextSquares[aiMove] = aiPointer;
            onPlay(nextSquares);
        } else {
            console.error('Invalid AI move received:', aiMove);
        }

    } catch (error) {
        console.error('Error making OpenAI API request:', error);
    }
};