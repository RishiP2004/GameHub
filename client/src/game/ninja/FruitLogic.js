import { useEffect, useRef } from 'react';

export const FruitLogic = ({
                               canvasRef,
                               setScore,
                               isGameOver,
                               setGameOver,
                               swipeDetected,
                               swipeMidpoint,
                               handleFruitSliced,
                               handleBombTriggered
                           }) => {
    const fruits = useRef([]);
    const bombs = useRef([]);

    // Function to add a new fruit
    const addFruit = () => {
        const fruit = {
            x: Math.random() * canvasRef.current.width,
            y: 0, // Start from top
            isSliced: false,
            radius: 30, // Set fruit radius
            speed: Math.random() * 2 + 1 // Random speed for falling
        };
        fruits.current.push(fruit);
    };

    // Function to add a new bomb
    const addBomb = () => {
        const bomb = {
            x: Math.random() * canvasRef.current.width,
            y: 0, // Start from top
            isExploding: false,
            explosionRadius: 5,
            speed: Math.random() * 2 + 1 // Random speed for falling
        };
        bombs.current.push(bomb);
    };

    const handleOutOfBounds = () => {
        const canvasHeight = canvasRef.current.height;

        // Remove out-of-bound fruits and bombs
        fruits.current = fruits.current.filter(fruit => {
            if (fruit.y > canvasHeight) {
                setGameOver(true);
                return false;
            }
            return true;
        });

        bombs.current = bombs.current.filter(bomb => {
            if (bomb.y > canvasHeight) {
                setGameOver(true);
                return false;
            }
            return true;
        });

        if (fruits.current.length === 0 && bombs.current.length === 0) {
            setGameOver(true);
        }
    };

    // Function to detect if a fruit is sliced
    const isSliced = (obj) => {
        if (!swipeMidpoint) return false;

        // Check if the fruit is sliced by the swipe midpoint
        const { x, y, radius } = obj;
        const [midX, midY] = swipeMidpoint;

        // Use a simple distance check to see if the swipe midpoint is within the fruit's area
        const distance = Math.hypot(midX - x, midY - y);
        return distance < radius;
    };

    const checkDetection = () => {
        if (!swipeDetected || !swipeMidpoint) return;

        fruits.current.forEach(fruit => {
            if (!fruit.isSliced && isSliced(fruit)) {
                fruit.isSliced = true;
                setScore(prevScore => prevScore + 1);
                handleFruitSliced();
            }
        });

        bombs.current.forEach(bomb => {
            if (!bomb.isExploding && isSliced(bomb)) {
                setGameOver(true);
                bomb.isExploding = true;
                handleBombTriggered();
            }
        });
    };

    const gameLoop = () => {
        if (isGameOver) return;

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        fruits.current.forEach(fruit => fruit.y += fruit.speed);
        bombs.current.forEach(bomb => bomb.y += bomb.speed);

        handleOutOfBounds();
        checkDetection();
    };

    useEffect(() => {
        if (isGameOver) return;

        const intervalId = setInterval(gameLoop, 1000 / 60); // 60fps
        const intervalFruit = setInterval(addFruit, 2000);   // Add fruit every 2 seconds
        const intervalBomb = setInterval(addBomb, 5000);     // Add bomb every 5 seconds

        return () => {
            clearInterval(intervalId);
            clearInterval(intervalFruit);
            clearInterval(intervalBomb);
        };
    }, [canvasRef, isGameOver]);

    return null;
};
