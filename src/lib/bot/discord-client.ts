import { Client, Collection, type ClientOptions } from "discord.js";

export default class DiscordBot extends Client {
  public commands: Collection<string, any> = new Collection();

  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
  }
}
