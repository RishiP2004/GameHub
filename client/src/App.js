import React from 'react';
import TopPlayers from './display/TopPlayers';
import PlayerStats from "./display/PlayerStats";
/*import UserLogin from "./login/UserLogin";*/
import {SocketProvider} from "./login/SocketData";
import Game from "./game/Game";

function App() {
    return (
        <SocketProvider>
            <TopPlayers />
            <PlayerStats />
            <Game />
            {/*<UserLogin>*/}
        </SocketProvider>
    );
}

export default App;