import React, { useState } from "react";
import './Queue.css';
import { useHistory } from "react-router-dom";
import { Connect4, TicTacToe } from "../GameIds";

/**
 * Queue component for handling player vs player selection.
 * Redirects to a game page with the two players once matched.
 *
 * @param {string} selectedGame - The selected game type (TicTacToe or Connect4).
 * @returns {JSX.Element} The Queue component.
 */
const Queue = ({ selectedGame }) => {
    const [ticTacToeQueue, setTicTacToeQueue] = useState([]);
    const [connect4Queue, setConnect4Queue] = useState([]);
    const [isQueueActive, setIsQueueActive] = useState(false);
    const history = useHistory();

    // Redirect both players to the game with the provided player1 and player2.
    const startGame = (player1, player2) => {
        history.push(`/game/${selectedGame}/${player1}/${player2}`);
    };

    // Handle the queue system when the queue button is clicked.
    const handleQueueClick = () => {
        let storedUsername = localStorage.getItem("user");
        const guestMode = localStorage.getItem('user') === "0";

        // Generate a unique guest username if in guest mode
        if (guestMode) storedUsername = "guest_" + (Math.floor(100000 + Math.random() * 900000));

        if (storedUsername) {
            if (selectedGame === TicTacToe) {
                setTicTacToeQueue(prevQueue => {
                    const newQueue = [...prevQueue, storedUsername];

                    if (newQueue.length >= 2) {
                        const [player1, player2] = [newQueue.shift(), newQueue.shift()];
                        startGame(player1, player2);
                        setIsQueueActive(false);
                    }

                    return newQueue;
                });
            } else if (selectedGame === Connect4) {
                setConnect4Queue(prevQueue => {
                    const newQueue = [...prevQueue, storedUsername];

                    if (newQueue.length >= 2) {
                        const [player1, player2] = [newQueue.shift(), newQueue.shift()];
                        startGame(player1, player2);
                        setIsQueueActive(false);
                    }

                    return newQueue;
                });
            }

            setIsQueueActive(true);
        } else {
            console.error("Username not found in localStorage.");
            history.push('/');
        }
    };

    // Handle cancelling the queue
    const handleCancelQueue = () => {
        if (selectedGame === TicTacToe) {
            setTicTacToeQueue([]);
        } else if (selectedGame === Connect4) {
            setConnect4Queue([]);
        }
        setIsQueueActive(false);
    };

    return (
        <div className="queue-container">
            <button className="queue-button" onClick={handleQueueClick}>
                VS Player
            </button>
            {isQueueActive && (
                <button className="queue-button" onClick={handleCancelQueue}>
                    Cancel Queue
                </button>
            )}
            <p>Players in Queue: {selectedGame === TicTacToe ? (ticTacToeQueue.length > 0 ? ticTacToeQueue.join(', ') : 'None') : (connect4Queue.length > 0 ? connect4Queue.join(', ') : 'None')}</p>
        </div>
    );
};

export default Queue