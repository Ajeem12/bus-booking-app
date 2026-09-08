exports.up = function (knex) {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table
      .integer("trip_sheet_id")
      .notNullable()
      .references("id")
      .inTable("trip_sheets")
      .onDelete("CASCADE");
    table.string("agent_name", 100);
    table.string("seat_number", 50);
    table.string("passenger_name", 100);
    table.string("boarding_point", 255);
    table.string("mobile_number", 20);
    table.string("deposit", 20);
    table.string("balance", 20);
    table.string("section", 20).defaultTo("sleeper");
    table.integer("sort_order").defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("bookings");
};
