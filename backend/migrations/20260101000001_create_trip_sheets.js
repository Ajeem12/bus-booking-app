exports.up = function (knex) {
  return knex.schema.createTable('trip_sheets', (table) => {
    table.increments('id').primary();
    table.string('trip_date', 20);
    table.string('service_name', 255).defaultTo('श्री साईं नाथ बस सर्विस मगरघटा  बेमेतरा');
    table.string('vehicle_number', 50);
    table.string('helper_name', 100);
    table.string('route', 255);
    table.string('driver_name', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('trip_sheets');
};
