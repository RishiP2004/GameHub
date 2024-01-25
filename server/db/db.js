const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './database.sqlite',
    },
    useNullAsDefault: true,
});

knex.schema.createTable('player', (table) => {
    table.autoIncrement('id').primaryKey()
    table.string('socketId').useNullAsDefault(false);
    table.string('playerName').useNullAsDefault(false);
    table.autoIncrement('wins').default(0)
}).then(() => {
    console.log("Database setup");
}).catch(() => {
    console.error("Database not setup");
}).finally(() => {
    knex.destroy();
})

module.exports = knex;