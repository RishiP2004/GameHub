const express = require('express');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite',
    },
    useNullAsDefault: true,
});
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {createServer} = require("node:http");
const {Server} = require("socket.io");
const secretKey = process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex'); // Use environment variable or generate if not present

const app = express();
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3002",
    }
});
// Middleware for checking API key
const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.SYSTEM_API_KEY) { // Check against an environment variable
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

app.use(express.static(path.join(__dirname, 'client', 'build')));

/**
 * Verify token API
 *
 * Checks if valid token through
 * JWT and sends back status
 * accordingly
 */
app.get('/api/verify-token', (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, secretKey, (err) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.sendStatus(200);
    });
});

/**
 * Register API
 *
 * Checks if username entry in
 * database and sends back a 1h
 * expiring JWT token, with set cookie
 */
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await knex('players').where({ username }).first();

        if (existingUser) {
            return res.status(401).json({ error: 'Username exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await knex('players').insert({
            username,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { username },
            secretKey,
            { expiresIn: '1h' }
        );
        res.cookie('authToken', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        console.error('Error during register:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Authentication API
 *
 * Checks if username and password
 * entries match in database and sends
 * back a 1h expiring JWT token, with
 * set cookie
 */
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await knex('players').where({ username }).first();

        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign(
            { username },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('authToken', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Player wins API
 *
 * Finds the amount of wins a user has for
 * a specific game and returns status accordingly
 *
 */
app.get('/api/player-wins/:username/:game', async (req, res) => {
    try {
        const { username, game } = req.params;

        const playerExists = await knex('players')
            .where({ username })
            .first();

        if (!playerExists) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const playerWins = await knex('player_wins')
            .select('gameName', 'wins')
            .where({ username, gameName: game });

        res.json({
            username,
            games: playerWins.length > 0 ? playerWins : []
        });
    } catch (error) {
        console.error('Error fetching player wins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Top Wins API
 *
 * Sends back Top Wins based on the specific game
 * Ordered by top 10 descending
 */
app.get('/api/top-wins/:game', async (req, res) => {
    const { game } = req.params;

    try {
        const topPlayers = await knex('player_wins')
            .select('username', 'wins')
            .where({ gameName: game })
            .orderBy('wins', 'desc')
            .limit(10);

        if (topPlayers.length === 0) {
            return res.status(404).json({ error: `No data found for game ${game}` });
        }

        res.json({
            game,
            topPlayers
        });
    } catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Update wins API
 *
 * Updates a user's win count for a specific game
 * Can only be used by the system
 */
app.put('/api/player/:username/updateWins/:game', checkApiKey, async (req, res) => {
    const { username, game } = req.params;

    try {
        const playerExists = await knex('players')
            .where({ username })
            .first();
        if (!playerExists) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const existingRecord = await knex('player_wins')
            .where({ username, gameName: game })
            .first();

        if (existingRecord) {
            await knex('player_wins')
                .where({ username, gameName: game })
                .increment('wins', 1);
        } else {
            await knex('player_wins')
                .insert({ username, gameName: game, wins: 1 });
        }
        const updatedWins = await knex('player_wins')
            .select('gameName', 'wins')
            .where({ username });

        res.json({
            username,
            games: updatedWins
        });
    } catch (error) {
        console.error('Error updating wins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

io.on("connection", (socket) => {
    console.log("New client connected");

    // Generate a unique game ID and join the room
    socket.on("createGame", ({ player1, player2 }, callback) => {
        const gameId = crypto.randomBytes(4).toString('hex'); // Generate a 4-byte (8-character) gameId
        socket.join(gameId); // The socket joins the game room
        console.log(`Game created with ID: ${gameId}, Players: ${player1} and ${player2}`);
        callback(gameId); // Send the gameId back to the client
    });

    socket.on("playerMove", (data) => {
        const { gameId, nextSquares } = data;

        // Broadcast the move to everyone in the room except the sender
        socket.to(gameId).emit("gameUpdate", nextSquares);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
