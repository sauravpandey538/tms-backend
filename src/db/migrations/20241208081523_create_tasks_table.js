exports.up = async function (knex) {
  await knex.schema.createTable("tasks", function (table) {
    table.increments("id").primary(); // Auto-incremented primary key for the task
    table.string("title").notNullable(); // Title of the task
    table.text("description"); // Description of the task
    table.date("dueDate"); // Due date for the task
    table.boolean("doNotify").defaultTo(false); // Boolean for whether the user should be notified
    table.integer("author_id").unsigned().notNullable(); // Foreign key reference to the user
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Timestamp for when the task was created
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Timestamp for when the task was last updated

    // Foreign key constraint to ensure 'author_id' exists in the 'users' table
    table.foreign("author_id").references("users.id").onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("tasks");
};
