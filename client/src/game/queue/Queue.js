import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './Queue.css';
import {Connect4, TicTacToe} from "../GameIds";

/**
 * Simple Queue structure to handle
 * Player vs Player selection
 * Redirects to a game with the two players
 * once matched
 */
const Queue = ({ selectedGame }) => {
    const [ticTacToeQueue, setTicTacToeQueue] = useState([]);
    const [connect4Queue, setConnect4Queue] = useState([]);
    const [isQueueActive, setIsQueueActive] = useState(false);
    const history = useHistory();

    const startGame = (player1, player2) => {
        history.push(`/game/${selectedGame}/${player1}/${player2}`);
    };

    const handleQueueClick = () => {
        let storedUsername = localStorage.getItem("user");
        const guestMode = localStorage.getItem('user') === 0;

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

export default Queue;
