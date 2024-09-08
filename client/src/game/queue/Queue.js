import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './Queue.css';

/**
 * Simple Queue structure to handle
 * Player vs Player selection
 * Redirects to a game with the two players
 * once matched
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Queue = () => {
    const [queue, setQueue] = useState([]);
    const [isQueueActive, setIsQueueActive] = useState(false);
    const history = useHistory();

    const startGame = (player1, player2) => {
        history.push(`/game/${player1}/${player2}`);
    };

    const handleQueueClick = () => {
        let storedUsername = localStorage.getItem("user");
        const guestMode = localStorage.getItem('user') === 0;

        if (guestMode) storedUsername = "guest_" + (Math.floor(100000 + Math.random() * 900000));

        if (storedUsername) {
            setQueue(prevQueue => {
                const newQueue = [...prevQueue, storedUsername];

                if (newQueue.length >= 2) {
                    const [player1, player2] = [newQueue.shift(), newQueue.shift()];
                    startGame(player1, player2);
                    setIsQueueActive(false);
                }

                return newQueue;
            });

            setIsQueueActive(true);
        } else {
            console.error("Username not found in localStorage.");
            history.push('/');
        }
    };

    const handleCancelQueue = () => {
        setQueue([]);
        setIsQueueActive(false);
    };

    return (
        <div className="queue-container">
            <button className="queue-button" onClick={handleQueueClick}>
                VS Player
            </button>
            {isQueueActive && queue.length > 0 && (
                <button className="queue-button" onClick={handleCancelQueue}>
                    Cancel Queue
                </button>
            )}
            <p>Players in Queue: {queue.length > 0 ? queue.join(', ') : 'None'}</p>
        </div>
    );
};

export default Queue;
