import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { PointerDetection } from './PointerDetection';
import { FruitLogic } from './FruitLogic';

const NinjaGame = ({ onBack, onRestart, handleFruitSliced, handleBombTriggered }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [swipeDetected, setSwipeDetected] = useState(false);
    const [swipeMidpoint, setSwipeMidpoint] = useState(null);
    const [startCountdown, setStartCountdown] = useState(3); // Countdown starts from 3 seconds
    const [gameStarted, setGameStarted] = useState(false); // Track whether the game has started

    useEffect(() => {
        let countdownTimer;
        if (startCountdown > 0) {
            countdownTimer = setInterval(() => {
                setStartCountdown(prev => prev - 1);
            }, 1000); // Decrease countdown every second
        } else if (startCountdown === 0) {
            setGameStarted(true); // Start the game when countdown reaches zero
            clearInterval(countdownTimer);
        }

        return () => clearInterval(countdownTimer); // Cleanup on unmount
    }, [startCountdown]);

    useEffect(() => {
        if (!gameOver) {
            const cleanupHandDetection = PointerDetection(webcamRef, canvasRef, (midpoint) => {
                setSwipeDetected(true); // Set swipe detected
                setSwipeMidpoint(midpoint); // Update swipe midpoint
            });

            return () => {
                if (cleanupHandDetection) {
                    cleanupHandDetection();  // Clean up hand detection when component unmounts or game ends
                }
            }
        }
    }, [setSwipeDetected, setSwipeMidpoint, gameOver]); // Removed setSwipeDetected and setSwipeMidpoint from the dependencies

    useEffect(() => {
        if (swipeDetected) {
            setSwipeDetected(false); // Reset swipe detected
        }
    }, [swipeDetected]);

    return (
        <>
            {gameOver ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '3rem',
                        color: 'red',
                        textAlign: 'center',
                    }}
                >
                    Game Over
                    <button
                        onClick={onBack}
                        style={{
                            display: 'block',
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={onRestart}
                        style={{
                            display: 'block',
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Restart
                    </button>
                </div>
            ) : (
                <>
                    <Webcam ref={webcamRef} />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            zIndex: 8,
                            width: 640,
                            height: 480,
                        }}
                    />
                    <FruitLogic
                        canvasRef={canvasRef}
                        setScore={setScore}
                        isGameOver={gameOver}
                        setGameOver={setGameOver}
                        handleFruitSliced={handleFruitSliced}
                        handleBombTriggered={handleBombTriggered}
                        swipeDetected={swipeDetected}
                        swipeMidpoint={swipeMidpoint} // Pass the midpoint to FruitLogic
                    />
                </>
            )}
        </>
    );
};

export default NinjaGame;
