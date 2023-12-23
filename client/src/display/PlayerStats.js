import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';
import {GetSocket} from "../login/SocketData";

function PlayerStats() {
    const [myWins, setMyWins] = useState(0);
    const { socketId } = GetSocket();

    useEffect(() => {
        if (socketId) {
            axios.get(`/player-wins/${socketId}`)
                .then(response => setMyWins(response.data.wins))
                .catch(error => console.error('Error fetching my wins:', error));
        }
    }, [socketId]);

    return (
        <div className="player-stats">
            <h1>My Wins: <span className="wins-value">{myWins}</span></h1>
        </div>
    );
}

export default PlayerStats;
