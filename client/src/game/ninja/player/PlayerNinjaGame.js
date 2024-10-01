import React, { useEffect, useRef, useState } from 'react';
import { FruitLogic } from './FruitLogic';
import { PointerDetection } from './PointerDetection';
import Webcam from "react-webcam";
import io from 'socket.io-client'; // Import the socket.io client
import './NinjaGame.css';
import {TicTacToePlayer} from "../../tictactoe/player/TicTacToePlayer";
import {NinjaPlayer} from "./NinjaPlayer";

const socket = io("http://localhost:4000"); // Connect to the socket server

const PlayerNinjaGame = ( { player1, player2 } ) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null); // Game canvas
    const overlayCanvasRef = useRef(null); // Pointer canvas
    const [swipeDetected, setSwipeDetected] = useState(false);
    const [swipeMidpoint, setSwipeMidpoint] = useState(null);
    const [startCountdown, setStartCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
    const [gameId, setGameId] = useState(0);

    // Player instances
    const player1Instance = new NinjaPlayer({ username: player1, color: 'red' });
    const player2Instance = new NinjaPlayer({ username: player2, color: 'blue' });

    // Handle countdown timer to start the game
    useEffect(() => {
        if (startCountdown > 0) {
            const countdownTimer = setInterval(() => {
                setStartCountdown(prev => prev - 1);
            }, 1000);

            return () => clearInterval(countdownTimer);
        } else if (startCountdown === 0 && !gameStarted) {
            handleGameStarted();
        }
    }, [startCountdown, gameStarted]);

    const cleanupSocket = () => {
        socket.off("updateGame");
        socket.disconnect();
    };
    // Join the game room when component mounts
    useEffect(() => {
        socket.on('createGame', ({ player1, player2 }, generatedGameId) => {
            setGameId(generatedGameId);
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player1 });
            socket.emit('joinGame', { gameId: generatedGameId, playerId: player2 });
            games[generatedGameId] = {lastUpdated: Date.now()};

            // Set a timer to remove the game after 15 minutes of inactivity
            setTimeout(() => {
                if (Date.now() - games[generatedGameId].lastUpdated > 15 * 60 * 1000) {
                    delete games[generatedGameId];
                    handleGameEnd();
                }
            }, 15 * 60 * 1000);
        });
        socket.on('playerDisconnected', ({ player }) => {
            alert(`${player} has disconnected. The game will end.`);
            handleGameEnd();
        });
        return () => {
            cleanupSocket();
        };
    }, [gameId, playerId]);

    // Handle pointer detection using webcam and hand detection
    useEffect(() => {
        if (!isGameOver) {
            const cleanupHandDetection = PointerDetection(webcamRef, overlayCanvasRef, (midpoint) => {
                setSwipeDetected(true);
                setSwipeMidpoint(midpoint);
                socket.emit('pointerMove', { gameId, playerId, midpoint }); // Emit pointer move with gameId and playerId
            });

            return () => {
                if (cleanupHandDetection) {
                    cleanupHandDetection();  // Clean up hand detection when component unmounts or game ends
                }
            };
        }
    }, [isGameOver, gameId, playerId]);

    // Reset swipe detection after it’s processed
    useEffect(() => {
        if (swipeDetected) {
            setSwipeDetected(false); // Reset swipe detected
        }
    }, [swipeDetected]);

    // Start the game and emit to the server
    const handleGameStarted = () => {
        setGameStarted(true);
        socket.emit('gameStarted', { gameId });
    };

    // Handle game over and emit to the server
    const handleGameOver = () => {
        setGameOver(true);
        socket.emit('gameOver', { gameId });
    };

    // Handle bomb trigger and emit to the server
    const handleBombTriggered = (bombId) => {
        socket.emit('bombTriggered', { gameId, bombId });
        handleGameOver();
    };

    // Handle fruit slicing and emit to the server
    const handleFruitSliced = (fruitId) => {
        socket.emit('fruitSliced', { gameId, playerId, fruitId });
    };

    return (
        <>
            <Webcam
                ref={webcamRef}
                style={{
                    position: 'absolute',
                    width: "640px",
                    height: "480px",
                    opacity: 0, // Make it invisible but still functional
                }}
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                }}
            />
            <canvas ref={canvasRef} className="game-canvas" />
            <canvas ref={overlayCanvasRef} className="pointer-canvas" />
            {isGameOver && (
                <div className="game-over-message">Game Over!</div>
            )}
            <FruitLogic
                canvasRef={canvasRef}
                isGameOver={isGameOver}
                setGameOver={setGameOver}
                isGameStarted={gameStarted}
                swipeDetected={swipeDetected}
                swipeMidpoint={swipeMidpoint}
                handleFruitSliced={handleFruitSliced}
                handleBombTriggered={handleBombTriggered}
                player1={player1Instance}
                player2={player2Instance}
                gameId={gameId}
            />

            {/* Countdown before the game starts */}
            {!gameStarted && startCountdown > 0 && (
                <div className="countdown">Game starts in: {startCountdown}</div>
            )}
        </>
    );
};

export default PlayerNinjaGame;
