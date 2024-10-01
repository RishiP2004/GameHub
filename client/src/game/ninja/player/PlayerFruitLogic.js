import { useEffect, useRef } from 'react';
import io from 'socket.io-client'; // Import socket.io client

const socket = io("http://localhost:4000"); // Connect to the socket server

export const PlayerFruitLogic = ({
                                canvasRef,
                                isGameOver,
                                isGameStarted,
                                setGameOver,
                                swipeDetected,
                                swipeMidpoint,
                                handleFruitSliced,
                                handleBombTriggered,
                                player1,
                                player2,
                                gameId // Add gameId to keep track of the game
                                }) => {
    const fruits = useRef([]);
    const bombs = useRef([]);

    // Check if fruit or bomb is sliced
    const isSliced = (obj) => {
        if (!swipeMidpoint) return false;
        const { x, y, radius } = obj;
        const [midX, midY] = swipeMidpoint;
        const distance = Math.hypot(midX - x, midY - y);
        return distance < radius;
    };

    // Emit request to add a new fruit to the game
    const addFruit = () => {
        socket.emit("addFruit", { gameId });
    };

    // Emit request to add a new bomb to the game
    const addBomb = () => {
        socket.emit("addBomb", { gameId });
    };

    // Detect swipes and trigger slicing events
    const checkDetection = () => {
        if (!swipeDetected || !swipeMidpoint) return;

        fruits.current.forEach(fruit => {
            if (!fruit.isSliced && isSliced(fruit)) {
                fruit.isSliced = true;
                handleFruitSliced(fruit.id); // Emit event to the server
            }
        });

        bombs.current.forEach(bomb => {
            if (!bomb.isExploding && isSliced(bomb)) {
                setGameOver(true);
                bomb.isExploding = true;
                handleBombTriggered(bomb.id); // Emit event to the server
            }
        });
    };

    // Handle out-of-bounds fruits/bombs
    const handleOutOfBounds = () => {
        const canvasHeight = canvasRef.current.height;

        fruits.current = fruits.current.filter(fruit => {
            return fruit.y <= canvasHeight;
        });

        bombs.current = bombs.current.filter(bomb => {
            if (bomb.y > canvasHeight) {
                setGameOver(true);
                return false;
            }
            return true;
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

    // Listen for fruits and bombs added by the server
    useEffect(() => {
        if (!isGameStarted) return;

        socket.on('fruitAdded', (fruit) => {
            fruits.current.push(fruit);
        });

        socket.on('bombAdded', (bomb) => {
            bombs.current.push(bomb);
        });

        // Cleanup socket listeners when component unmounts
        return () => {
            socket.off('fruitAdded');
            socket.off('bombAdded');
        };
    }, [isGameStarted]);

    // Main game setup and intervals
    useEffect(() => {
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
    }, [isGameStarted, isGameOver]); // Add isGameStarted and isGameOver to dependencies

    return null;
};
