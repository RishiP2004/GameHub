import React, {useState} from 'react';
import NinjaGame from '../NinjaGame';
import {useHistory} from "react-router-dom";

const SingleNinjaGame = () => {
    const [gameKey, setGameKey] = useState(Date.now());
    const history = useHistory();
    const handleGameEnd = () => {
        history.push('/'); // Redirect to home or appropriate page
    };

    const onBack = () => {
        handleGameEnd()
    };

    const onRestart = () => {
        setGameKey(Date.now()); // Unique key to force re-render
        console.log('Restart button clicked');
    };

    return (
        <NinjaGame
            key={gameKey}
            onBack={onBack}
            onRestart={onRestart}
        />
    );
};

export default SingleNinjaGame;
