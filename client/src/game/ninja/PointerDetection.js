import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

export const PointerDetection = (webcamRef, canvasRef, onSwipe) => {
    let animationFrameId;
    let previousFingerTip = null;
    let swipeThreshold = 20;  // Lower the swipe detection threshold for more sensitivity
    let swipeStartPoint = null;
    let swipeEndPoint = null;

    const detectHand = async (net) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const hands = await net.estimateHands(video);

            if (hands.length > 0) {
                const currentFingerTip = hands[0].landmarks[8]; // Index finger tip

                // Initialize swipeStartPoint if it's not set
                if (!swipeStartPoint) {
                    swipeStartPoint = currentFingerTip;
                }

                // Detect swipe by measuring the distance between swipeStartPoint and currentFingerTip
                const swipeDetected = detectSwipe(swipeStartPoint, currentFingerTip);

                // Only handle swipe if detected
                if (swipeDetected) {
                    console.log('Swipe detected');
                    swipeEndPoint = currentFingerTip;  // Update the end point of swipe
                    const midpoint = calculateMidpoint(swipeStartPoint, swipeEndPoint);
                    onSwipe(midpoint);  // Trigger onSwipe callback

                    // Draw swipe path only if a swipe was detected
                    drawFingerTip(canvasRef.current, currentFingerTip, swipeStartPoint, swipeEndPoint);

                    // Reset swipeStartPoint to current position for next swipe
                    swipeStartPoint = currentFingerTip;
                } else {
                    // No swipe detected; just update the end point for drawing
                    swipeEndPoint = currentFingerTip;
                }

                // Always draw the fingertip
                drawFingerTip(canvasRef.current, currentFingerTip, swipeStartPoint, swipeEndPoint);
            } else {
                // No hand detected, reset both points
                swipeStartPoint = null;
                swipeEndPoint = null;
            }
        }

        animationFrameId = requestAnimationFrame(() => detectHand(net));
    };

    // Calculate the midpoint between two points
    const calculateMidpoint = (startPoint, endPoint) => {
        if (!startPoint || !endPoint) return null;
        return [
            (startPoint[0] + endPoint[0]) / 2,
            (startPoint[1] + endPoint[1]) / 2
        ];
    };

    // Detect swipe based on the distance between previousPoint and currentPoint
    const detectSwipe = (previousPoint, currentPoint) => {
        if (!previousPoint || !currentPoint) return false;

        // Calculate distance moved
        const distanceMoved = Math.hypot(currentPoint[0] - previousPoint[0], currentPoint[1] - previousPoint[1]);
        return distanceMoved > swipeThreshold;  // Return true if the distance exceeds threshold
    };

    // Draw the fingertip and swipe path on the canvas
    const drawFingerTip = (canvas, currentFingerTip, swipeStart, swipeEnd) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentFingerTip) {
            const [x, y] = currentFingerTip;

            // Draw the fingertip circle
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);  // Draw fingertip as a red circle
            ctx.fill();
        }

        // Draw the swipe path if swipeStart and swipeEnd are available and a swipe was detected
        if (swipeStart && swipeEnd && swipeEnd[0] !== swipeStart[0] && swipeEnd[1] !== swipeStart[1]) {
            console.log('Drawing swipe path');
            ctx.beginPath();
            ctx.moveTo(swipeStart[0], swipeStart[1]);
            ctx.lineTo(swipeEnd[0], swipeEnd[1]);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    };

    const startHandPoseDetection = async () => {
        try {
            const net = await handpose.load();
            console.log("Handpose model loaded successfully");
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
