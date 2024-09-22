import knex from 'knex';

export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite',
    },
    useNullAsDefault: true,
});

/**
 * Set up the database schemas: players, player_wins
 *
 * 'players' stores auth information
 * 'player_wins' stores win information per game
 *
 * @returns {Promise<void>}
 */
export const setupDatabase = async () => {
    try {
        // Create the 'players' table for user authentication and player information
        await db.schema.createTable('players', (table) => {
            table.string('username').primary().notNullable().unique();
            table.string('password').notNullable();
        });

        // Create the 'player_wins' table to store player's wins with game type
        await db.schema.createTable('player_wins', (table) => {
            table.string('username').notNullable();
            table.string('gameName').notNullable();
            table.integer('wins').defaultTo(0);
            table.foreign('username').references('username').inTable('players').onDelete('CASCADE'); // Link to players username
        });

        console.log('Database setup successfully');
    } catch (error) {
        console.error('Database setup failed:', error);
    } finally {
        await db.destroy();
    }
}
