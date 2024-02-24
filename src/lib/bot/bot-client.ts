import fs from "fs";
import path from "path";
import {
  type TextChannel,
  type ClientOptions,
  Client,
  Events,
  REST,
  Routes,
} from "discord.js";
import { clientLogger } from "../utils/util";
import { botConfig } from "./config";
import DiscordBot from "./discord-client";

export class Bot extends DiscordBot {
  // Discord.js client instance.
  public clientInstance: DiscordBot;
  private commandsArray: any[] = [];

  constructor(options: ClientOptions) {
    super(options);

    // Initialize the client instance.
    this.clientInstance = new DiscordBot(options);
    this.clientInstance.login(botConfig.token); // Login to the client instance.

    // Set the commands collection to the client instance.
    this.loadCommands();
    this.refreshRegisteredCommands();

    // Client event listeners as client is ready.
    this.clientInstance.on("ready", () => {
      clientLogger(`Logged in as ${this.clientInstance.user?.tag}!`);
    });

    /**
     * Event listener for client commands.
     */
    this.clientInstance.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = (interaction.client as DiscordBot).commands.get(
        interaction.commandName
      );

      if (!command) {
        clientLogger(
          `No command matching ${interaction.commandName} was found.`,
          "warn"
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }

  /**
   * Event listener for when the client is ready.
   */
  private loadCommands() {
    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder, "index.js");

      const command = require(commandsPath);

      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        this.clientInstance.commands.set(command.data.name, command);
        this.commandsArray.push(command.data.toJSON());
      } else {
        clientLogger(
          `The command at ${commandsPath} is missing a required "data" or "execute" property.`,
          "warn"
        );
      }
    }
  }

  private async refreshRegisteredCommands() {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(botConfig.token);

    // and deploy your commands!
    try {
      clientLogger(
        `Started refreshing ${this.commandsArray.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationGuildCommands(botConfig.clientId, botConfig.guildId),
        { body: this.commandsArray }
      );

      clientLogger(
        `Successfully reloaded ${
          (data as any).length
        } application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  }

  public sendMessage(roomId: string, message: string): void {
    (this.clientInstance.channels.cache.get(roomId) as TextChannel)?.send(
      message
    );

    clientLogger(`Bot send message: \"${message}\" to room ${roomId}.`);
  }
}
