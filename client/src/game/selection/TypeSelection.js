import React from 'react';
import { useHistory } from 'react-router-dom';
import { Ninja, TicTacToe } from "../GameIds";
import Queue from "../queue/Queue";
import './TypeSelection.css';

/**
 * Gamemode type selection component
 *
 * @param selectedGame
 * @param setSelectedGame
 * @returns {Element}
 * @constructor
 */
const TypeSelection = ({ selectedGame, setSelectedGame }) => {
    const history = useHistory();
    const handleGameButtonClick = () => {
        const route = `/game/${selectedGame}/single`;
        history.push(route);
    };
    const handleBack = () => {
        history.push('/game-selection');
        setSelectedGame(false);
    };

    return (
        <div className="type-selection-container">
            <Queue />
            <button className="type-selection-button" onClick={handleGameButtonClick}>
                {selectedGame === TicTacToe || selectedGame === Ninja ? 'VS AI' : 'Single Player'}
            </button>
            <button className="type-selection-button" onClick={handleBack}>
                Back
            </button>
        </div>
    );
};

export default TypeSelection;
