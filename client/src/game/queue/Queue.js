import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Queue = () => {
    const [queue, setQueue] = useState([]);
    const history = useHistory();

    const startGame = (player1, player2) => {
        history.push(`/game/${player1}/${player2}`);
    };

    const handleClick = () => {
        const storedUsername = localStorage.getItem("user");

        if (storedUsername) {
            setQueue([...queue, storedUsername]);

            if (queue.length >= 1) {
                const player1 = queue.shift();
                const player2 = queue.shift();

                if (player1 && player2) {
                    startGame(player1, player2);
                } else {
                    setQueue([...queue, player1, player2]);
                }
            }
        } else {
            console.error("Username not found in localStorage.");
        }
    };

    return (
        <div>
            <button onClick={handleClick}>VS Player</button>
            <p>Players in Queue: {queue.join(', ')}</p>
        </div>
    );
};

export default Queue;