import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopPlayers.css';
/**
 * Show top players based on current game
 * selected
 *
 * @param selectedGame
 * @returns {Element}
 * @constructor
 */
const TopPlayers = (selectedGame) => {
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
