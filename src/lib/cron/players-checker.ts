import { Client, Routes, TextChannel } from "discord.js";
import { clientBot } from "../../server";
import { botConfig, clientOptions } from "../bot/config";
import { getPlayers } from "../rp-service/rp.service";
import { clientLogger } from "../utils/util";
import { channel } from "diagnostics_channel";

/**
 * Accepts a number of min players, and runs a cron job
 * to notify all users to when that min-players has crossed.
 */
export class PlayerChecker {
  private minPlayers: number = -1;
  private checked: boolean = false;
  private previousPlayers: number = -1;
  private roomId = "924074254855704609";

  constructor(minPlayers: number) {
    this.minPlayers = minPlayers;
  }

  public async check() {
    const players = await getPlayers(botConfig.eclipseIp);
    this.previousPlayers = players > -1 ? players : this.previousPlayers;

    clientLogger(`Players checker result: ${players}`);

    if (this.checkPlayers(players) && !this.checked) {
      // Emit message
      this.toggleChecked();
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
