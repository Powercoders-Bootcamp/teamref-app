const express = require("express");
const { Client } = require("pg");

const app = express();

// DB config from Kubernetes Secret
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
};

app.get("/", async (req, res) => {
  let client;

  try {
    client = new Client(dbConfig);
    await client.connect();

    // 1) Get current timestamp
    const timeResult = await client.query("SELECT NOW();");

    // 2) Count tables in the current schema (public)
    const tableCountResult = await client.query(`
      SELECT COUNT(*) AS table_count
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public';
    `);

    const tableCount = tableCountResult.rows[0].table_count;

    res.send(`
      <h1>Hello, Powercoders!</h1>
      <h2>Team Infra App</h2>

      <p>✔ Successfully connected to database!</p>

      <p><strong>Database Name:</strong> ${process.env.DB_NAME}</p>
      <p><strong>DB Current Time:</strong> ${timeResult.rows[0].now}</p>
      <p><strong>Number of Tables:</strong> ${tableCount}</p>

      <hr />
      <p>This information is coming directly from the PostgreSQL database.</p>
    `);
  } catch (error) {
    res.send(`
      <h1>Hello, Powercoders!</h1>
      <h2>Team Reference App</h2>
      <p>❌ Database connection failed.</p>
      <pre>${error}</pre>
    `);
  } finally {
    if (client) {
      await client.end();
    }
  }
});

app.listen(3000, () => {
  console.log("TeamRef App running on port 3000");
});

