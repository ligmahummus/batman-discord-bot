import express from "express";
import dotenv from "dotenv";
import { Bot } from "./lib/bot/bot-client";
import { clientOptions } from "./lib/bot/config";
import { clientLogger } from "./lib/utils/util";
import path from "path";
import "./lib/cron";
import { Cron } from "./lib/cron";
import AuditService from "./lib/audit/audit-service";
import auditController from "./controller/audit-controller";
import { PlayerChecker } from "./lib/check-players/players-checker.service";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));

// Main source of the bot instance.
export const clientBot: Bot = new Bot(clientOptions);
export let name = "dude";

const PORT = process.env.PORT || 42069;

app.use("/api/audit", auditController);

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
  AuditService.connect();
  Cron.start();
});
