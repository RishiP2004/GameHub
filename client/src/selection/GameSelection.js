import React from "react";
import Queue from "../game/queue/Queue";

/**
 * Simple component to choose between
 * playing against AI or another Player
 *
 * @returns {JSX.Element}
 * @constructor
 */
const GameSelection = () => {
    return (
        <div>
            <Queue />
            <button onClick={() => history.push('/ai-game')}>VS AI</button>
        </div>
    );
}

export default GameSelection;