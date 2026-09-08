require("dotenv").config();

module.exports = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  },
  migrations: {
    directory: "./migrations",
  },
};
