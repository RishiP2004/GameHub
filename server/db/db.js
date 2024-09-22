const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite',
    },
    useNullAsDefault: true,
});

/**
 * Database table setup
 */
async function setupDatabase() {
    try {
        // Create the 'players' table for user authentication and player information
        await knex.schema.createTable('players', (table) => {
            table.string('username').primary().notNullable().unique();
            table.string('password').notNullable();
        });

        // Create the 'player_wins' table to store player's wins with game type
        await knex.schema.createTable('player_wins', (table) => {
            table.string('username').notNullable();
            table.string('gameName').notNullable();
            table.integer('wins').defaultTo(0);
            table.foreign('username').references('username').inTable('players').onDelete('CASCADE'); // Link to players username
        });

        console.log("Database setup successfully");
    } catch (error) {
        console.error("Database setup failed:", error);
    } finally {
        knex.destroy();
    }
}
module.exports = knex;