import express from "express";
import dotenv from "dotenv";
import { Bot } from "./lib/bot/bot-client";
import { clientOptions } from "./lib/bot/config";
import { clientLogger } from "./lib/utils/util";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main source of the bot instance.
export const clientBot: Bot = new Bot(clientOptions);
export let name = "dude";

const PORT = process.env.PORT || 80;

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/name", (req, res) => {
  res.send(name);
});

app.post("/name", (req, res) => {
  name = req.body.name;
  res.send("name changed to " + name);
});

app.listen(+PORT, () => {
  clientLogger(`Server listening on port ${PORT}`);
});
