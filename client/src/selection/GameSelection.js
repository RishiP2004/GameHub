import React from "react";
import Queue from "../game/queue/Queue";

const GameSelection = () => {
    return (
        <div>
            <Queue />
            <button onClick={() => history.push('/ai-game')}>VS AI</button>
        </div>
    );
}

export default GameSelection;