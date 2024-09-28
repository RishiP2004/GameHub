import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { HandDetection } from './HandDetection';
import { FruitLogic } from './FruitLogic';

const NinjaGame = ({ onBack, onRestart, handleFruitSliced, handleBombTriggered }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [swipeDetected, setSwipeDetected] = useState(false);
    const [swipeMidpoint, setSwipeMidpoint] = useState(null);

    useEffect(() => {
        if (!gameOver) {
            const cleanupHandDetection = HandDetection(webcamRef, canvasRef,(midpoint) => {
                setSwipeDetected(true); // Set swipe detected
                setSwipeMidpoint(midpoint); // Update swipe midpoint
            });

            return () => {
                cleanupHandDetection(); // Clean up hand detection when component unmounts or game ends
            };
        }
    }, [gameOver]);

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
