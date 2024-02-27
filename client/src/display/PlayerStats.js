import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';

/**
 * Updates the win count of a user
 * by calling server-side api
 *
 * @param {string} username
 */
export async function updateWins(username) {
    try {
        await axios.put(`/api/player/${username}/updateWins`);
        console.log("Updated wins");
    } catch (error) {
        console.error('Error updating win count:', error);
    }
}

/**
 * Element to display the user's wins
 * based on count from server-side api
 *
 * @returns {JSX.Element}
 * @constructor
 */
function PlayerStats() {
    const [myWins, setMyWins] = useState(0);
    const guestMode = JSON.parse(localStorage.getItem('user')) === 0;
    if(guestMode) return null;

    useEffect(() => {
        let username = JSON.parse(localStorage.getItem('user'));
        if (username) {
            axios.get(`/player-wins/${username}`)
                .then(response => setMyWins(response.data.wins))
                .catch(error => console.error('Error fetching wins:', error));
        }
    });

    return (
        <div className="player-stats">
            <h1>My Wins: <span className="wins-value">{myWins}</span></h1>
        </div>
    );
}

export default PlayerStats;