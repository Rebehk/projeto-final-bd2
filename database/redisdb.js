require("dotenv").config();
const redis = require("redis");
const client = redis.createClient({ url: "redis://localhost:6379" });

async function conectar() {
  await client.connect();
  return client;
}

module.exports = {
    conectar
}