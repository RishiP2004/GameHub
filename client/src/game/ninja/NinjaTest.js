import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { PointerDetection } from './PointerDetection';

const NinjaTest = ({}) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
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
        const cleanupHandDetection = PointerDetection(webcamRef, canvasRef,(midpoint) => {
            setSwipeDetected(true); // Set swipe detected
            setSwipeMidpoint(midpoint); // Update swipe midpoint
        });

        return () => {
            if (cleanupHandDetection) {
                cleanupHandDetection();  // Clean up hand detection when component unmounts or game ends
            }
        }
    }, [setSwipeDetected, setSwipeMidpoint]);

    useEffect(() => {
        if (swipeDetected) {
            setSwipeDetected(false); // Reset swipe detected
        }
    }, [swipeDetected]);

    return (
        <>
            {(
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
                </>
            )}
        </>
    );
};

export default NinjaTest;