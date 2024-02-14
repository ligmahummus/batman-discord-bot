import { clientBot } from "../../server";
import { botConfig } from "../bot/config";
import {
  getPlayers,
  minimumPlayersNotification,
} from "../rp-service/rp.service";
import { clientLogger } from "../utils/util";
import {
  blockQuote,
  quote,
  bold,
  underscore,
  userMention,
} from "@discordjs/formatters";

/**
 * Accepts a number of min players, and runs a cron job
 * to notify all users to when that min-players has crossed.
 */
export class PlayerChecker {
  private minPlayers: number = -1;
  private previousPlayers: {
    time: number;
    players: number;
  } = {
    time: 0,
    players: 0,
  };

  private roomId = "1182102002298277888"; // General channel
  // private roomId = "1207111946877272224"; // test channel

  constructor() {
    this.minPlayers = minimumPlayersNotification;
  }

  public async check() {
    const players = await getPlayers(botConfig.eclipseIp);

    clientLogger(
      `Player count now is ${players}. Previous at ${new Date(
        this.previousPlayers.time
      ).toISOString()} was ${this.previousPlayers.players}.`
    );

    if (!this.isPlayersOkay(players)) return;

    const usersToMention = [
      "354559995854979072", // Oran
      "148112076613746689", // Ariel
      "413029556132380674", // Itay
    ];

    const botMessage = quote(
      `Eclipse Roleplay (${botConfig.eclipseIp}) is now at ${bold(
        underscore(players.toString())
      )} players!\n`
    );

    let previousMessage = "";

    if (
      this.previousPlayers.time > 0 &&
      this.previousPlayers.players > 0 &&
      players !== this.previousPlayers.players
    ) {
      previousMessage = blockQuote(
        `\nPrevious player count was ${this.previousPlayers.players.toString()} at ${new Date(
          this.previousPlayers.time
        ).toLocaleString("he-il")}.`
      );
    }

    clientBot.sendMessage(
      this.roomId,
      `${usersToMention.map((uid: string) => userMention(uid))}\n` +
        botMessage +
        previousMessage
    );

    this.previousPlayers = {
      time: Date.now(),
      players: players,
    };
  }

  private isPlayersOkay(players: number): boolean {
    return players <= this.minPlayers;
  }
}
