import React, { useEffect, useRef, useState } from 'react';
import { FruitLogic } from './FruitLogic';
import { PointerDetection } from './PointerDetection';
import Webcam from "react-webcam";
import './NinjaTest.css'; // Adjust the path as necessary

const NinjaTest = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null); // Game canvas
    const overlayCanvasRef = useRef(null); // Pointer canvas
    const [swipeDetected, setSwipeDetected] = useState(false);
    const [swipeMidpoint, setSwipeMidpoint] = useState(null);
    const [startCountdown, setStartCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        let countdownTimer;
        if (startCountdown > 0) {
            countdownTimer = setInterval(() => {
                setStartCountdown(prev => prev - 1);
            }, 1000);
        } else if (startCountdown === 0) {
            setGameStarted(true);
            clearInterval(countdownTimer);
        }

        return () => clearInterval(countdownTimer);
    }, [startCountdown]);

    useEffect(() => {
        if (!isGameOver) {
            const cleanupHandDetection = PointerDetection(webcamRef, overlayCanvasRef, (midpoint) => {
                setSwipeDetected(true); // Set swipe detected
                setSwipeMidpoint(midpoint); // Update swipe midpoint
            });

            return () => {
                if (cleanupHandDetection) {
                    cleanupHandDetection();  // Clean up hand detection when component unmounts or game ends
                }
            };
        }
    }, [isGameOver]);

    useEffect(() => {
        if (swipeDetected) {
            setSwipeDetected(false); // Reset swipe detected
        }
    }, [swipeDetected]);

    const handleFruitSliced = () => {
        // Handle fruit slicing logic
    };

    const handleBombTriggered = () => {
        setGameOver(true);
    };

    return (
        <>
            <Webcam ref={webcamRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="game-canvas" />
            <canvas ref={overlayCanvasRef} className="pointer-canvas" />
            {isGameOver && (
                <div className="game-over-message">Game Over!</div>
            )}
            <FruitLogic
                canvasRef={canvasRef}
                setScore={setScore}
                isGameOver={isGameOver}
                setGameOver={setGameOver}
                swipeDetected={swipeDetected}
                swipeMidpoint={swipeMidpoint}
                handleFruitSliced={handleFruitSliced}
                handleBombTriggered={handleBombTriggered}
            />

            <div className="score">Score: {score}</div>
        </>
    );
};

export default NinjaTest;
