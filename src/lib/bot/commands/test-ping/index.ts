import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("test-ping")
    .setDescription("Replies with do-the-Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Test do-the-Pong!");
  },
};
