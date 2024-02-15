import { clientBot } from "../../server";
import { botConfig } from "../bot/config";
import {
  getPlayers,
  minimumPlayersNotification,
} from "../rp-service/rp.service";
import { BuildMessage } from "../utils/build-message";
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
  private roomId = "1207363497537577102"; // marian-bot channel
  // private roomId = "1207111946877272224"; // test channel
  private minPlayers: number = -1;
  private previousPlayers: {
    time: string;
    players: number;
  } = {
    time: "",
    players: 0,
  };

  constructor() {
    this.minPlayers = minimumPlayersNotification;
  }

  public async check() {
    const players = await getPlayers(botConfig.eclipseIp);

    clientLogger(
      `Player count now is ${players}. Previous at ${this.previousPlayers.time} was ${this.previousPlayers.players}.`
    );

    if (!this.isPlayersOkay(players)) return;

    const msg = new BuildMessage();

    const usersToMention = [
      "354559995854979072", // Oran
      "148112076613746689", // Ariel
      "413029556132380674", // Itay
    ];

    msg.addMessage(
      `Eclipse Roleplay is now at ${BuildMessage.boldUnderscore(
        players.toString()
      )} players!`
    );

    if (
      this.previousPlayers.time !== "" &&
      this.previousPlayers.players > 0 &&
      players !== this.previousPlayers.players
    ) {
      msg.addMessage(
        `- Previous player count was ${this.previousPlayers.players.toString()} at ${
          this.previousPlayers.time
        }.`
      );
    }

    // msg.addMessage(
    //   usersToMention.map((uid: string) => userMention(uid)).join(",")
    // );

    clientBot.sendMessage(this.roomId, blockQuote(msg.build()));

    this.previousPlayers = {
      time: new Date().toLocaleString("he-il", { timeZone: "Asia/Jerusalem" }),
      players: players,
    };
  }

  private isPlayersOkay(players: number): boolean {
    return players <= this.minPlayers;
  }
}
