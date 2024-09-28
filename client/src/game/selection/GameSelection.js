import React from 'react';
import { useHistory } from 'react-router-dom';
import './GameSelection.css';
import {Ninja, TicTacToe} from "../GameIds";

const GameSelection = ({ setSelectedGame }) => {
    const history = useHistory();
    // Handle game being selected
    const handleGameButtonClick = (game) => {
        setSelectedGame(game);
        history.push('/type-selection');
    };
    // Handle log out being chosen
    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        setSelectedGame(false);
        history.push('/');
    };
    //TODO add check for guest mode log out thing
    return (
        <div className="game-selection-container">
            <button className="game-selection-button" onClick={() => handleGameButtonClick(TicTacToe)}>
                Tic Tac Toe
            </button>
            <button className="game-selection-button" onClick={() => handleGameButtonClick(Ninja)}>
                Ninja
            </button>
            <button className="game-selection-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default GameSelection;
