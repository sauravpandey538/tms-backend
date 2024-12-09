require("dotenv").config();

const database = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: "./src/db/migrations", // Updated path
  },
  seeds: {
    directory: "./src/db/seeds", // Updated path
  },
};

module.exports = {
  development: database,
};
