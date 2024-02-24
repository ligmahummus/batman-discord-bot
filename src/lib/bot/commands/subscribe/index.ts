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
      avatar: interaction.user.avatar
        ? SubscriberService.getAvatarUrl(
            interaction.user.id,
            interaction.user.avatar
          )
        : "https://i.pinimg.com/474x/5c/be/a6/5cbea638934c3a0181790c16a7832179.jpg",
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
