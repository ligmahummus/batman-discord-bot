import {
  SlashCommandBuilder,
  blockQuote,
  type ChatInputCommandInteraction,
  CacheType,
  bold,
} from "discord.js";
import { playerCount } from "../../../rp-service/rp.service";

export = {
  data: new SlashCommandBuilder()
    .setName("players")
    .setDescription("Replies with the current player count on Eclipse RP."),
  async execute(interaction: ChatInputCommandInteraction) {
    const server = await playerCount("play.eclipse-rp.net:22005");
    await interaction.reply(
      blockQuote(
        `${bold("Server name")}: ${server?.name}\n${bold(
          "Current player count"
        )}: ${server?.players}`
      )
    );
  },
};
