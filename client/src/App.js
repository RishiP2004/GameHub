import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TopPlayers from './display/TopPlayers';
import PlayerStats from "./display/PlayerStats";
import UserLogin from "./login/UserLogin";
import axios from "axios";
import GameSelection from "./selection/GameSelection";
import AIGame from "./game/ai/AIGame";
import PlayerGame from "./game/player/PlayerGame";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

        if (authToken) {
            axios.get('http://localhost:3001/verify-token', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then(() => {
                setLoggedIn((prevLoggedIn) => !prevLoggedIn);
                const decodedToken = decodeURIComponent(atob(authToken.split('.')[1]));
                const { username } = JSON.parse(decodedToken);
                localStorage.setItem('user', JSON.stringify(username));
            }).catch((error) => {
                console.error('Token verification failed:', error);
            });

        }
    }, [setLoggedIn]);
    return (
        <Router>
            <Switch>
                <PlayerStats />
                <TopPlayers />
                <Route path="/game/:player1/:player2">
                    <PlayerGame />
                </Route>
                <Route path="/ai-game">
                    <AIGame />
                </Route>
                <Route path="/" exact>
                    {loggedIn ? (
                        <GameSelection />
                    ) : (
                        <UserLogin setLoggedIn={setLoggedIn} />
                    )}
                </Route>
            </Switch>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;