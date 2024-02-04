import OpenAI from 'openai';
import {calculateWinner} from "../GameUtils";

const API_KEY = "API_KEY";

async function getAIMove(squares, selectedPointer, onPlay) {
    if (calculateWinner(squares)) return;

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

export default getAIMove;