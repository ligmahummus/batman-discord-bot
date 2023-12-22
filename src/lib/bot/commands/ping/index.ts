import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Test Pong!");
  },
};
