import { clientBot } from "../../server";
import { botConfig } from "../bot/config";
import {
  getPlayers,
  minimumPlayersNotification,
} from "../rp-service/rp.service";
import { clientLogger } from "../utils/util";
import {
  hyperlink,
  blockQuote,
  quote,
  bold,
  underscore,
  roleMention,
  userMention,
} from "@discordjs/formatters";

/**
 * Accepts a number of min players, and runs a cron job
 * to notify all users to when that min-players has crossed.
 */
export class PlayerChecker {
  private minPlayers: number = -1;
  private checked: boolean = false;
  private previousPlayers: number = -1;
  private roomId = "1182102002298277888"; // General channel
  // private roomId = "1207111946877272224"; // test channel

  constructor() {
    this.minPlayers = minimumPlayersNotification;
  }

  public async check() {
    const players = await getPlayers(botConfig.eclipseIp);
    this.previousPlayers = players > -1 ? players : this.previousPlayers;

    clientLogger(`Players checker result: ${players}`);

    if (this.checkPlayers(players) && !this.checked) {
      // Emit message
      this.toggleChecked();

      const usersToMention = [
        "354559995854979072", // Oran
        "148112076613746689", // Ariel
        "413029556132380674", // Itay
      ];

      clientBot.sendMessage(
        this.roomId,
        `${usersToMention.map((uid: string) => userMention(uid))}\n` +
          quote(
            `Eclipse Roleplay (${botConfig.eclipseIp}) is now at ${bold(
              underscore(players.toString())
            )} players!\n`
          )
      );
    } else if (!this.checkPlayers(players) && this.checked) {
      // Do not emit but toggle
      this.toggleChecked();
    }
  }

  private checkPlayers(players: number): boolean {
    return players <= this.minPlayers;
  }

  private toggleChecked(): void {
    this.checked = !this.checked;
    clientLogger(`Send status is now ${this.checked}`);
  }
}
