import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

export const PointerDetection = (webcamRef, overlayCanvasRef, onSwipe) => {
    let animationFrameId;
    let swipeThreshold = 20;
    let swipeStartPoint = null;
    let swipeDetected = false; // Track whether a swipe is detected

    const detectHand = async (net) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            // Set pointer canvas size
            overlayCanvasRef.current.width = videoWidth;
            overlayCanvasRef.current.height = videoHeight;

            const hands = await net.estimateHands(video);

            if (hands.length > 0) {
                const currentFingerTip = hands[0].landmarks[8];

                // Initialize swipeStartPoint if it's not set
                if (!swipeStartPoint) {
                    swipeStartPoint = currentFingerTip;
                }
                // Detect swipe
                swipeDetected = detectSwipe(swipeStartPoint, currentFingerTip);

                if (swipeDetected) {
                    const midpoint = calculateMidpoint(swipeStartPoint, currentFingerTip);
                    onSwipe(midpoint); // Notify parent component
                    drawFingerTip(overlayCanvasRef.current, currentFingerTip, swipeStartPoint, true); // Draw swipe line
                } else {
                    drawFingerTip(overlayCanvasRef.current, currentFingerTip, swipeStartPoint, false); // No swipe line
                }
                swipeStartPoint = currentFingerTip; // Update start point
            } else {
                swipeStartPoint = null; // Reset if no hand detected
            }
        }
        animationFrameId = requestAnimationFrame(() => detectHand(net));
    };

    // Calculate midpoint
    const calculateMidpoint = (startPoint, endPoint) => {
        if (!startPoint || !endPoint) return null;
        return [
            (startPoint[0] + endPoint[0]) / 2,
            (startPoint[1] + endPoint[1]) / 2
        ];
    };

    // Detect swipe
    const detectSwipe = (previousPoint, currentPoint) => {
        if (!previousPoint || !currentPoint) return false;
        const distanceMoved = Math.hypot(currentPoint[0] - previousPoint[0]);
        return distanceMoved > swipeThreshold;
    };

    // Draw fingertip and swipe line
    const drawFingerTip = (canvas, currentFingerTip, swipeStartPoint, drawLine) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

        if (currentFingerTip) {
            const [x, y] = currentFingerTip;
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();

            // If swipe is detected, draw the line
            if (drawLine && swipeStartPoint) {
                const [startX, startY] = swipeStartPoint;
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    };

    const startHandPoseDetection = async () => {
        try {
            const net = await handpose.load();
            await detectHand(net);
        } catch (error) {
            console.error("Error loading handpose model:", error);
        }
    };

    startHandPoseDetection();

    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
};
