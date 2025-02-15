import { createClient } from "redis";

export let client;

const connectRedis = async () => {
  if (client) return client;

  client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => {
    console.error("Redis error:", err);
  });

  client.on("connect", () => {
    console.log("Connected to Redis successfully!");
  });

  client.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
  });

  try {
    await client.connect();
    console.log("Redis client connected");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }

  return client;
};

export default connectRedis;
