import { clientBot } from "../../server";
import AuditService from "../audit/audit-service";
import { botConfig } from "../bot/config";
import {
  getPlayers,
  minimumPlayersNotification,
} from "../rp-service/rp.service";
import { SubscriberService } from "../subscribe/subscriber.service";
import { BuildMessage } from "../utils/build-message";
import { clientLogger } from "../utils/util";
import { blockQuote, userMention } from "@discordjs/formatters";
import checkerConfig from "./checker.config";

/**
 * Accepts a number of min players, and runs a cron job
 * to notify all users to when that min-players has crossed.
 */
export class PlayerChecker {
  private state: boolean = true;
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
    if (!this.state)
      return clientLogger("Checking players service is OFF", "warn");
    const players = await getPlayers(botConfig.eclipseIp);

    clientLogger(
      `Player count now is ${players}. Previous at ${this.previousPlayers.time} was ${this.previousPlayers.players}.`
    );

    AuditService.log(players);

    if (!this.isPlayersOkay(players)) return;

    const msg = new BuildMessage();

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

    const usersToMention = await SubscriberService.getSubscribers();
    console.log("🚀 ~ PlayerChecker ~ check ~ usersToMention:", usersToMention);

    msg.addMessage(
      usersToMention.map((uid: string) => userMention(uid)).join(",")
    );

    clientBot.sendMessage(checkerConfig.roomId, blockQuote(msg.build()));

    this.previousPlayers = {
      time: new Date().toLocaleString("he-il", { timeZone: "Asia/Jerusalem" }),
      players: players,
    };
  }

  private isPlayersOkay(players: number): boolean {
    return players <= this.minPlayers && players > 0;
  }
}
