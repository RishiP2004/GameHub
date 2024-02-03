const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite',
    },
    useNullAsDefault: true,
});

knex.schema.createTable('player', (table) => {
    table.increments('id').primaryKey()
    table.string('playerName').useNullAsDefault(false);
    table.integer('wins').default(0)
}).then(() => {
    console.log("Database setup");
}).catch(() => {
    console.error("Database not setup");
}).finally(() => {
    knex.destroy();
})

module.exports = knex;