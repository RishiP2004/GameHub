import React from 'react';
import { useHistory } from 'react-router-dom';
import Queue from '../game/queue/Queue';
import './GameSelection.css';

/**
 * Simple component to choose between
 * playing against AI or another Player
 *
 * @returns {JSX.Element}
 * @constructor
 */
const GameSelection = () => {
    const history = useHistory();

    const handleAIButtonClick = () => {
        history.push('/ai-game');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        history.push('/');
    };

    return (
        <div className="game-selection-container">
            <Queue />
            <button className="game-selection-button" onClick={handleAIButtonClick}>
                VS AI
            </button>
            <button className="game-selection-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default GameSelection;
