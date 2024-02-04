import React from "react";
import Queue from "../game/queue/Queue";

function GameSelection() {
    return (
        <div>
            <Queue />
            <button onClick={() => history.push('/ai-game')}>VS AI</button>
        </div>
    );
}

export default GameSelection;