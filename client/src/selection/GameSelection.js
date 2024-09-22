import React from 'react';
import { useHistory } from 'react-router-dom';
import './GameSelection.css';
import {Connect4, TicTacToe} from "../game/GameIds";

const GameSelection = ({ setSelectedGame }) => {
    const history = useHistory();

    const handleGameButtonClick = (game) => {
        setSelectedGame(game);
        history.push('/type-selection');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        history.push('/');
    };
    //add check for guest mode log out thing
    return (
        <div className="game-selection-container">
            <button className="game-selection-button" onClick={() => handleGameButtonClick(TicTacToe)}>
                Tic Tac Toe
            </button>
            <button className="game-selection-button" onClick={() => handleGameButtonClick(Connect4)}>
                Connect Four
            </button>

            <button className="game-selection-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default GameSelection;
