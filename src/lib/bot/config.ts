import { type ClientOptions, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { clientLogger } from "../utils/util";
import path from "path";

// Required to load .env file.
dotenv.config({
  path: path.join(__dirname, "../../../.env"),
});

let token: string = "";
let clientId: string = "";
let clientSecret: string = "";
let guildId: string = "";

// Set the bot token and client ID based on the environment.
// if (process.env.NODE_ENV === "production") {
//   clientLogger("Running in production mode.");

token = process.env.BOT_TOKEN || "";
clientId = process.env.BOT_CLIENT_ID || "";
clientSecret = process.env.BOT_SECRET_ID || "";
guildId = process.env.BOT_SERVER_ID || "";
// } else {
//   clientLogger("Running in development mode.");

//   token = process.env.BOT_TOKEN_DEV || "";
//   clientId = process.env.BOT_CLIENT_ID_DEV || "";
//   clientSecret = process.env.BOT_SECRET_ID_DEV || "";
//   guildId = process.env.BOT_SERVER_ID_DEV || "";
// }

/**
 * Bot main configuration object.
 */
export const botConfig = {
  token: token,
  clientId: clientId,
  clientSecret: clientSecret,
  guildId: guildId,
  appId: process.env.BOT_APP_ID || "",
  eclipseIp: "play.eclipse-rp.net:22005",
  eclipsInvite: "rage://v/connect?ip=play.eclipse-rp.net:22005",
};

clientLogger(JSON.stringify(botConfig, null, 2));

/**
 * Client options for the Client Discord bot class.
 * Intents are required to pick which events are received/allowed from the server.
 * @see https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
 * @see https://discord.com/developers/docs/topics/gateway#list-of-intents
 */
export const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
};

export type BotConfig = typeof botConfig;
