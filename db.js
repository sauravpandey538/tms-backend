const knex = require("knex");
const knexfile = require("./knexfile");

// Configure Knex with your development settings
const dbConfig = knex(knexfile.development);

// Test the connection
dbConfig
  .raw("SELECT 1+1 AS result")
  .then((result) => {
    console.log("Database connection successful:", result.rows);
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  })
  .finally(() => {
    // dbConfig.destroy(); // Close the database connection
  });

module.exports = dbConfig;
