const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite',
    },
    useNullAsDefault: true,
});
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'client', 'build')));

/**
app.post('/user-login', async (req, res) => {
    try {
        const { socketId, username, password } = req.body;

        const player = await knex('players')
            .select('playerName', 'password')
            .where({ socketId })
            .first();

        if (!player || (player.password !== password && player.playerName !== username)) {
            res.status(404).json({ error: 'Player not found or incorrect password' });
            return;
        }

        res.json(player);
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/
app.get('/player-wins/:socketId', async (req, res) => {
    try {
        const { socketId } = req.params;

        const player = await knex('players')
            .select('playerName', 'wins')
            .where({ socketId })
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

app.get('/top-players', async (req, res) => {
    try {
        const topPlayers = await knex('players')
            .select('playerName', 'wins')
            .orderBy('wins', 'desc')
            .limit(10);

        res.json(topPlayers);
    } catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/player/:socketId/updateWins', async (req, res) => {
    const { socketId } = req.params;

    try {
        const player = await knex('player')
            .where({ socketId })
            .first();
        if (player) {
            await knex('player').where({ socketId }).increment('wins', 1);

            const updatedPlayer = await knex('player')
                .select('wins')
                .where({ socketId })
                .first();
            res.json({ updatedWinCount: updatedPlayer.wins });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating win count', error: error.message });
    }
});

app.get('/', (req, res) => {
    console.log('Root page requested');
    res.send('Connected to React');
});

io.on('connection', (socket) => {
    socket.on('setSocketId', (mySocketId) => {
        console.log(`Received socket ID from client: ${mySocketId}`);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});