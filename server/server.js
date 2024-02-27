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
const secretKey = crypto.randomBytes(32).toString('hex');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client', 'build')));
/**
 * Verify token API
 *
 * Checks if valid token through
 * JWT and sends back status
 * accordingly
 */
app.get('/verify-token', (req, res) => {
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
app.post('http://localhost:3001/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await knex('players').where({ username }).first();

        if (existingUser) {
            return res.status(401).json({ error: 'Username exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [userId] = await knex('players').insert({
            username,
            password: hashedPassword,
        });

        const newUser = await knex('players').where({ id: userId }).first();

        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            secretKey,
            { expiresIn: '1h' }
        );
        res.cookie('authToken', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        console.error('Error during register:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
/**
 * Authentication API
 *
 * Checks if username and password
 * entries match in database and sends
 * back a 1h expiring JWT token, with
 * set cookie
 */
app.post('http://localhost:3001/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await knex('players').where({ username }).first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err || !passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                secretKey,
                { expiresIn: '1h' }
            );

            res.cookie('authToken', token, { httpOnly: true });
            res.json({ token });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * Player wins API
 *
 * Finds the amount of wins a username
 * has and returns status accordingly
 */
app.get('/player-wins/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const player = await knex('players')
            .select('username', 'wins')
            .where(username)
            .first();

        if (!player) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }

        res.json(player);
    } catch (error) {
        console.error('Error fetching player wins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/*
 * Top Wins API
 *
 * Sends back Top Wins based on usernames
 * Ordered by top 10 ascending
 */
app.get('/top-wins', async (req, res) => {
    try {
        const topPlayers = await knex('players')
            .select('username', 'wins')
            .orderBy('wins', 'desc')
            .limit(10);

        res.json(topPlayers);
    } catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * Update wins API
 *
 * Updates a user's win count
 */
app.put('/api/player/:username/updateWins', async (req, res) => {
    const { username } = req.params;

    try {
        const player = await knex('player')
            .where({ playerName: username })
            .first();
        if (player) {
            await knex('player').where({ playerName: username }).increment('wins', 1);

            const updatedPlayer = await knex('player')
                .select('wins')
                .where({ playerName: username })
                .first();
            res.json({ updatedWinCount: updatedPlayer.wins });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating win count', error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});