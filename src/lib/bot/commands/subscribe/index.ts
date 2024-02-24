import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import {
  SubUser,
  SubscriberService,
} from "../../../subscribe/subscriber.service";

export = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription(
      "Using this command you will subscribe / unsubscribe to the bot's minimum players notifications."
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const userPayload: SubUser = {
      id: interaction.user.id,
      username: interaction.user.username,
    };
    if (await SubscriberService.handleSubscribe(userPayload)) {
      interaction.reply({
        content: `You successfully subscribed to the bot's notifications. :partying_face:`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: `It's sad to see you go, but you have been unsubscribed from the bot's notifications. :wave::pensive:`,
        ephemeral: true,
      });
    }
  },
};
