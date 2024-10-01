import {db} from "../db/db.js";
/**
 * Player wins API
 *
 * Finds the amount of wins a user has for
 * a specific game and returns status accordingly
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getPlayerWins = async (req, res) => {
    try {
        const { username, game } = req.params;

        const playerExists = await db('players').where({ username }).first();

        if (!playerExists) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const playerWins = await db('player_wins')
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
};

/**
 * Top Wins API
 *
 * Sends back Top Wins based on the specific game
 * Ordered by top 10 descending
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getTopPlayers = async (req, res) => {
    const { game } = req.params;

    try {
        const topPlayers = await db('player_wins')
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
};

/**
 * Update wins API
 *
 * Updates a user's win count for a specific game
 * Can only be used by the system
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const updatePlayerWins = async (req, res) => {
    const { username, game } = req.params;

    try {
        const playerExists = await db('players').where({ username }).first();

        if (!playerExists) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const existingRecord = await db('player_wins')
            .where({ username, gameName: game })
            .first();

        if (existingRecord) {
            await db('player_wins')
                .where({ username, gameName: game })
                .increment('wins', 1);
        } else {
            await db('player_wins').insert({ username, gameName: game, wins: 1 });
        }

        const updatedWins = await db('player_wins')
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
};
