import express from "express";
import dotenv from "dotenv";
import { Bot } from "./lib/bot/bot";
import { clientOptions } from "./lib/bot/config";
import { clientLogger } from "./lib/utils/util";
dotenv.config();

const app = express();

// Main source of the bot instance.
export const clientBot: Bot = new Bot(clientOptions);

const PORT = process.env.PORT || 42069;

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(+PORT, () => {
  clientLogger(`Server listening on port ${PORT}`);
});
