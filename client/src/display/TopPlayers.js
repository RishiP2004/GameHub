import React, {useEffect, useState} from 'react';
import axios from "axios";
import './TopPlayers.css';

/**
 * Element to display the top players
 * from server-side top calculation api
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
    })
    return (
        <div className="top-players-container">
            <h2>Top Players</h2>
            <ul>
                {topPlayers.map((player, index) => (
                    <li key={index}>{player.playerName} - Wins: {player.wins}</li>
                ))}
            </ul>
        </div>
    )
}

export default TopPlayers;