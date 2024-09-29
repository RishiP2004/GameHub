import { useEffect, useRef } from 'react';

export const FruitLogic = ({
                               canvasRef,
                               setScore,
                               isGameOver,
                               isGameStarted,
                               setGameOver,
                               swipeDetected,
                               swipeMidpoint,
                               handleFruitSliced,
                               handleBombTriggered
                           }) => {
    const fruits = useRef([]);
    const bombs = useRef([]);

    // Add new fruit with adjusted size and speed
    const addFruit = () => {
        const fruit = {
            x: Math.random() * canvasRef.current.width,
            y: 0,
            isSliced: false,
            radius: Math.random() * (3) + 3,
            speed: Math.random() * 2 + 1.5
        };
        fruits.current.push(fruit);
    };

    // Add new bomb with adjusted size and speed
    const addBomb = () => {
        const bomb = {
            x: Math.random() * canvasRef.current.width,
            y: 0,
            isExploding: false,
            explosionRadius: 7,
            speed: Math.random() * 2 + 2
        };
        bombs.current.push(bomb);
    };

    // Check if fruit or bomb is sliced
    const isSliced = (obj) => {
        if (!swipeMidpoint) return false;
        const { x, y, radius } = obj;
        const [midX, midY] = swipeMidpoint;
        const distance = Math.hypot(midX - x, midY - y);
        return distance < radius;
    };

    // Detect swipes
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

    // Game loop for drawing and updating
    const gameLoop = () => {
        if (isGameOver || !isGameStarted) return; // Only run the game if it has started and not over

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions based on the parent container
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        // Enable antialiasing (smoothing) for better visuals
        ctx.imageSmoothingEnabled = true;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw fruits
        fruits.current.forEach(fruit => {
            fruit.y += fruit.speed; // Update position
            drawFruit(ctx, fruit);  // Draw fruit
        });

        // Draw bombs
        bombs.current.forEach(bomb => {
            bomb.y += bomb.speed; // Update position
            drawBomb(ctx, bomb);  // Draw bomb
        });

        // Check for slicing
        checkDetection();

        // Remove out-of-bounds objects
        handleOutOfBounds();
    };

    // Handle out-of-bounds fruits/bombs
    const handleOutOfBounds = () => {
        const canvasHeight = canvasRef.current.height;

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
    };

    // Draw a fruit
    const drawFruit = (ctx, fruit) => {
        if (fruit.isSliced) return;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    };

    // Draw a bomb
    const drawBomb = (ctx, bomb) => {
        if (bomb.isExploding) return;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bomb.explosionRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    };

    // Main game setup and intervals
    useEffect(() => {
        // Only start the game loop if the game has started and is not over
        if (!isGameStarted || isGameOver) return;

        // Use 60 frames per second (1000 ms / 60)
        const intervalId = setInterval(gameLoop, 1000 / 60);
        const intervalFruit = setInterval(addFruit, 1200); // Add fruit every 1.2 seconds
        const intervalBomb = setInterval(addBomb, 5000); // Add bomb every 5 seconds

        return () => {
            clearInterval(intervalId);
            clearInterval(intervalFruit);
            clearInterval(intervalBomb);
        };
    }, [canvasRef, isGameStarted, isGameOver]); // Add isGameStarted and isGameOver to dependencies

    return null;
};
