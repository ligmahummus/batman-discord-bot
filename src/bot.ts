import { botConfig, clientOptions } from "./lib/config";
import { Client } from "discord.js";
import { blockQuote, bold } from "@discordjs/formatters";
import { clientLogger } from "./lib/util";
import { playerCount } from "./lib/rp.service";

export function main() {
  const client = new Client(clientOptions);

  /**
   * Event listener for when the client is ready.
   */
  client.on("ready", () => {
    clientLogger(`Logged in as ${client.user?.tag}!`);
  });

  /**
   * Event listener for client messages for ANY channel.
   */
  client.on("messageCreate", async (msg) => {
    const content = msg.content.toLowerCase();
    if (content === "ping") {
    } else if (content === "players") {
      msg.reply("Fetching player count...");
      playerCount("play.eclipse-rp.net:22005")
        .then((server) => {
          if (server) {
            msg.reply(
              blockQuote(
                `${bold("Server:")} ${
                  server.name
                } - ${server.gamemode.toUpperCase()}\n${bold(
                  "Current players:"
                )} ${server.players} / ${server.maxplayers}`
              )
            );
          } else {
            msg.reply("Failed to fetch player count.");
          }
        })
        .catch((err) => {
          console.error(err);
          msg.reply("Errored while fetching player count.");
        });
    }
  });

  client.login(botConfig.token);
}
