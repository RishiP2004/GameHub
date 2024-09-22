import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import HomePage from './home/HomePage';
import UserLogin from './auth/UserLogin';
import UserRegister from './auth/UserRegister';
import GameSelection from './selection/GameSelection';
import TypeSelection from './selection/TypeSelection';
import TicTacToePlayerGame from "./game/tictactoe/player/TicTacToePlayerGame";
//import Connect4PlayerGame from './Connect4PlayerGame';
import TicTacToeAIGame from "./game/tictactoe/ai/TicTacToeAIGame";
//import Connect4AIGame from './Connect4AIGame';
import TopPlayers from "./display/TopPlayers";
import {Connect4, TicTacToe} from "./game/GameIds";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const guestMode = user === 0;
    const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    useEffect(() => {
        if (!authToken || guestMode) {
            setLoggedIn(guestMode);
        } else {
            axios.get('http://localhost:3001/verify-token', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then(() => {
                setLoggedIn(true);
            }).catch((error) => {
                console.error('Token verification failed:', error);
                setLoggedIn(false);
            });
        }
    }, [authToken, guestMode]);

    return (
        <Router>
            <TopPlayers selectedGame={selectedGame} />
            <Switch>
                {/* HomePage Route */}
                <Route path="/" exact>
                    {loggedIn || guestMode ? (
                        <Redirect to="/game-selection" />
                    ) : (
                        <HomePage />
                    )}
                </Route>
                {/* Login Page */}
                <Route path="/login">
                    {loggedIn || guestMode ? <Redirect to="/game-selection" /> : <UserLogin setLoggedIn={setLoggedIn} />}
                </Route>
                {/* Register Page */}
                <Route path="/register">
                    {loggedIn || guestMode? <Redirect to="/game-selection" /> : <UserRegister setLoggedIn={setLoggedIn} />}
                </Route>
                {/* Game Selection Route */}
                <Route path="/game-selection">
                    {loggedIn || guestMode? (
                        <GameSelection setSelectedGame={setSelectedGame} />
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>
                {/* Type Selection Route */}
                <Route path="/type-selection">
                    {loggedIn || guestMode? (
                        <TypeSelection selectedGame={selectedGame} />
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>

                {/* Game Routes with Player vs Player */}
                <Route path="/game/:game/:player1/:player2" exact>
                    {({ match }) => {
                        const { game, player1, player2 } = match.params;

                        if (loggedIn || guestMode) {
                            switch (game) {
                                case TicTacToe:
                                    return <TicTacToePlayerGame player1={player1} player2={player2} />;
                                case Connect4:
                                    return <TicTacToeAIGame player1={player1} player2={player2} />;
                                default:
                                    return <TicTacToePlayerGame player1={player1} player2={player2} />; // Default or fallback
                            }
                        } else {
                            return <Redirect to="/" />;
                        }
                    }}
                </Route>

                {/* Game Routes with AI */}
                <Route path="/game/:game/ai" exact>
                    {({ match }) => {
                        const { game } = match.params;

                        if (loggedIn || guestMode) {
                            switch (game) {
                                case TicTacToe:
                                    return <TicTacToeAIGame />;
                                case Connect4:
                                    return <TicTacToeAIGame />;
                                default:
                                    return <TicTacToeAIGame />; // Default or fallback
                            }
                        } else {
                            return <Redirect to="/" />;
                        }
                    }}
                </Route>
                {/* Fallback redirect to home */}
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}

export default App;
