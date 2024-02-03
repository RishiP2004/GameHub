import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';

function PlayerStats({ username }) {
    const [myWins, setMyWins] = useState(0);

    useEffect(() => {
        if (username) {
            axios.get(`/player-wins/${username}`)
                .then(response => setMyWins(response.data.wins))
                .catch(error => console.error('Error fetching wins:', error));
        }
    }, [username]);

    return (
        <div className="player-stats">
            <h1>My Wins: <span className="wins-value">{myWins}</span></h1>
        </div>
    );
}

export default PlayerStats;