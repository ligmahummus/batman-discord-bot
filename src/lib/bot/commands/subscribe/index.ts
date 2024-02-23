import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription(
      "Using this command you will subscribe / unsubscribe to the bot's minimum players notifications."
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    console.log("🚀 ~ execute ~ interaction.user.id:", interaction.user.id);
  },
};
