import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopPlayers.css';

/**
 * Element to display the top players based on the current game
 *
 * @param {Object} props
 * @param {string} props.selectedGame - The currently selected game to filter top players
 * @returns {JSX.Element}
 * @constructor
 */
function TopPlayers({ selectedGame }) {
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {
        if (selectedGame) {
            axios.get(`/top-players/${selectedGame}`)
                .then(response => setTopPlayers(response.data))
                .catch(error => console.error('Error fetching top players:', error));
        }
    }, [selectedGame]);

    return (
        <div className="top-players-container">
            <h2 className="leaderboard-title">🏆 Top Players 🏆</h2>
            {selectedGame ? (
                <ul className="leaderboard-list">
                    {topPlayers.length > 0 ? (
                        topPlayers.map((player, index) => (
                            <li key={index} className="leaderboard-item">
                                <span className="player-rank">{index + 1}.</span>
                                <span className="player-name">{player.playerName}</span>
                                <span className="player-wins">Wins: {player.wins}</span>
                            </li>
                        ))
                    ) : (
                        <li className="leaderboard-item">No top players for this game yet.</li>
                    )}
                </ul>
            ) : (
                <p>Please select a game to see the top players.</p>
            )}
        </div>
    );
}

export default TopPlayers;
