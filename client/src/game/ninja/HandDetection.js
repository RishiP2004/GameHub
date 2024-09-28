import * as handpose from '@tensorflow-models/handpose';
export const HandDetection = (webcamRef, canvasRef, onSwipe) => {
    let animationFrameId;
    let previousLandmarks = null;
    let swipeThreshold = 50; // Minimum distance to consider a swipe
    let initialLandmarks = null; // Store initial landmarks when swipe starts
    let finalLandmarks = null; // Store final landmarks when swipe ends

    const detectHand = async (net) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const hands = await net.estimateHands(video);

            if (hands.length > 0) {
                const currentLandmarks = hands[0].landmarks;

                if (previousLandmarks) {
                    const swipeDetected = detectSwipe(previousLandmarks, currentLandmarks);

                    if (swipeDetected) {
                        finalLandmarks = currentLandmarks; // Update final landmarks
                        const midpoint = calculateMidpoint(initialLandmarks, finalLandmarks);
                        console.log('Midpoint of swipe:', midpoint);
                        onSwipe(midpoint); // Trigger swipe callback with midpoint
                    }
                } else {
                    initialLandmarks = currentLandmarks; // Store initial landmarks
                }

                previousLandmarks = currentLandmarks;

                drawHand(hands, canvasRef.current);
            }
        }
        animationFrameId = requestAnimationFrame(() => detectHand(net));
    };

    const calculateMidpoint = (startLandmarks, endLandmarks) => {
        if (!startLandmarks || !endLandmarks) return null;

        // Average the position of all landmarks
        const startMidpoint = startLandmarks.reduce(
            (acc, [x, y]) => {
                acc[0] += x;
                acc[1] += y;
                return acc;
            },
            [0, 0]
        ).map(coord => coord / startLandmarks.length);

        const endMidpoint = endLandmarks.reduce(
            (acc, [x, y]) => {
                acc[0] += x;
                acc[1] += y;
                return acc;
            },
            [0, 0]
        ).map(coord => coord / endLandmarks.length);

        // Return the midpoint between the start and end midpoints
        return [
            (startMidpoint[0] + endMidpoint[0]) / 2,
            (startMidpoint[1] + endMidpoint[1]) / 2
        ];
    };

    const detectSwipe = (previousLandmarks, currentLandmarks) => {
        // Calculate the distance moved by hand landmarks
        let distanceMoved = 0;

        for (let i = 0; i < previousLandmarks.length; i++) {
            const [prevX, prevY] = previousLandmarks[i];
            const [currX, currY] = currentLandmarks[i];
            distanceMoved += Math.hypot(currX - prevX, currY - prevY);
        }
        return distanceMoved > swipeThreshold;
    };

    const drawHand = (hands, canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hands.forEach((hand) => {
            const landmarks = hand.landmarks;

            // Draw hand landmarks
            for (let i = 0; i < landmarks.length; i++) {
                const [x, y] = landmarks[i];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
        });
    };

    const startHandPoseDetection = async () => {
        const net = await handpose.load();
        await detectHand(net);
    };

    startHandPoseDetection().then(r => "");

    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
};
