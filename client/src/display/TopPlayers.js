import React, {useEffect, useState} from 'react';
import axios from "axios";
import './TopPlayers.css';

/**
 * Element to display the top players
 * from server-side top calculation API
 *
 * @returns {JSX.Element}
 * @constructor
 */
function TopPlayers() {
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {
        axios.get('/top-players')
            .then(response => setTopPlayers(response.data))
            .catch(error => console.error('Error fetching top players:', error));
    }, []);

    return (
        <div className="top-players-container">
            <h2 className="leaderboard-title">🏆 Top Players 🏆</h2>
            <ul className="leaderboard-list">
                {topPlayers.map((player, index) => (
                    <li key={index} className="leaderboard-item">
                        <span className="player-rank">{index + 1}.</span>
                        <span className="player-name">{player.playerName}</span>
                        <span className="player-wins">Wins: {player.wins}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopPlayers;
