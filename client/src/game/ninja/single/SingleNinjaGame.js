import React, { useState } from 'react';
import './NinjaGame.css';
import NinjaGame from "../NinjaGame";

const SingleNinjaGame = () => {
    const [score, setScore] = useState(0);

    // Handle fruit slicing
    const handleFruitSliced = () => {
        setScore(prevScore => prevScore + 1);
    };

    return (
        <>
            <NinjaGame
                handleFruitSliced={handleFruitSliced}
            />
            <div className="score">Score: {score}</div>
        </>
    );
};

export default SingleNinjaGame;
