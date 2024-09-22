import React from 'react';
import { useHistory } from 'react-router-dom';
import Queue from '../queue/Queue';
import './TypeSelection.css';

const TypeSelection = ({ selectedGame }) => {
    const history = useHistory();
    // AI Button selected
    const handleAIButtonClick = () => {
        history.push(`/game/${selectedGame}/ai`);
    };
    // Back Button Selected
    const handleBack = () => {
        history.push('/game-selection');
    };

    return (
        <div className="type-selection-container">
            <Queue />
            <button className="type-selection-button" onClick={handleAIButtonClick}>
                VS AI
            </button>
            <button className="type-selection-button" onClick={handleBack}>
                Back
            </button>
        </div>
    );
}

export default TypeSelection;
