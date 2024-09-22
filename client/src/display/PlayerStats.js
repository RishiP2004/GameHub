import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';

/**
 * Updates the win count of a user
 * by calling server-side API
 *
 * @param {string} username
 * @param {string} game
 */
export async function updateWins(username, game) {
    try {
        await axios.put(`/api/player/${username}/updateWins`, { gameName: game });
        console.log(`Updated wins for ${game}`);
    } catch (error) {
        console.error('Error updating win count:', error);
    }
}

/**
 * Element to display the user's wins
 * based on count from server-side API
 *
 * @param {Object} props
 * @param {string} props.gameName - The name of the game to fetch wins for
 * @returns {JSX.Element}
 * @constructor
 */
function PlayerStats({ gameName }) {
    const [myWins, setMyWins] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const username = JSON.parse(localStorage.getItem('user'));
    const guestMode = username === 0;

    useEffect(() => {
        if (!guestMode && username && gameName) {
            axios.get(`/player-wins/${username}?gameName=${gameName}`)
                .then(response => {
                    setMyWins(response.data.wins || 0);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching wins:', error);
                    setError('Error fetching win data.');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [gameName, username, guestMode]);

    if (guestMode) return null;

    return (
        <div className="player-stats">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <h1>{gameName} Wins: <span className="wins-value">{myWins}</span></h1>
            )}
        </div>
    );
}

export default PlayerStats;
