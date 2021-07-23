
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("username").unqiue;
        table.string("password");
        table.timestamps(false, true);
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
