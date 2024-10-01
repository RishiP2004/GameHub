import knex from 'knex';

export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite',
    },
    useNullAsDefault: true,
    debug: true,
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
        const hasPlayersTable = await db.schema.hasTable('players');

        if (!hasPlayersTable) {
            await db.schema.createTable('players', (table) => {
                table.string('username').primary().notNullable().unique();
                table.string('password').notNullable();
            });
        }
        const hasPlayerWinsTable = await db.schema.hasTable('player_wins');

        if (!hasPlayerWinsTable) {
            await db.schema.createTable('player_wins', (table) => {
                table.string('username').notNullable();
                table.string('gameName').notNullable();
                table.integer('wins').defaultTo(0);
                table.foreign('username').references('username').inTable('players').onDelete('CASCADE'); // Link to players username
            });
        }
        console.log('Database setup successfully');
    } catch (error) {
        console.error('Database setup failed:', error);
    }
}
