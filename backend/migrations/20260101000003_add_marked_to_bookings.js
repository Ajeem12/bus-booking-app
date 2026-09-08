exports.up = function (knex) {
  return knex.schema.table("bookings", (table) => {
    table.boolean("marked").notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("bookings", (table) => {
    table.dropColumn("marked");
  });
};
