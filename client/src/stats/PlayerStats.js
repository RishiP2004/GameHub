import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';

/**
 * Updates the win count of a user
 *
 * @param {string} username
 * @param {string} game
 */
export const updateWins = async (username, game) => {
    try {
        await axios.put(`http://localhost:4000/api/player/${username}/updateWins`, { gameName: game });
        console.log(`Updated wins for ${game}`);
    } catch (error) {
        console.error('Error updating win count:', error);
    }
}
/**
 * Receive and show Player's stats
 *
 * @param gameName
 * @returns {React.JSX.Element|null}
 * @constructor
 */
const PlayerStats = (gameName) => {
    const [myWins, setMyWins] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const username = JSON.parse(localStorage.getItem('user'));
    const guestMode = username === 0;

    useEffect(() => {
        if (!guestMode && username && gameName) {
            axios.get(`http://localhost:4000/api/player-wins/${username}?gameName=${gameName}`)
                .then(response => {
                    const fetchedWins = response.data.wins || 0;

                    if (fetchedWins !== myWins) {
                        setMyWins(fetchedWins);
                    }
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
    }, [gameName, username, guestMode, myWins]);

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
