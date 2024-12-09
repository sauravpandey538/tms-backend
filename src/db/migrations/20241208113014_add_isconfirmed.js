/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table("tasks", (table) => {
    table.timestamp("dueDate").nullable().alter();
    table.boolean("is_noticed").defaultTo(false).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table("tasks", (table) => {
    table.dropColumn("is_noticed");
    table.date("dueDate").nullable().alter();
  });
};
