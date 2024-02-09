import {
  SlashCommandBuilder,
  blockQuote,
  type ChatInputCommandInteraction,
  bold,
} from "discord.js";
import { playerCount } from "../../../rp-service/rp.service";
import { botConfig } from "../../config";

export = {
  data: new SlashCommandBuilder()
    .setName("players")
    .setDescription("Replies with the current player count on Eclipse RP."),
  async execute(interaction: ChatInputCommandInteraction) {
    const server = await playerCount(botConfig.eclipseIp);
    const serverFullName = server?.name || "N/A";

    // Standardize server players if number is missing - to -1
    const players = server?.players ? server.players : -1;

    // Standardize server name without '[RP]' tags...
    let serverName = serverFullName;

    if (serverFullName !== "N/A") {
      serverName = serverFullName.split("] ")[1].split(" [")[0];
    }

    await interaction.reply(
      blockQuote(
        `${bold("Server")}: ${serverName}\n${bold("Players")}: ${players}`
      )
    );
  },
};
