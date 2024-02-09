import { minimumPlayersNotification } from "../rp-service/rp.service";
import { clientLogger } from "../utils/util";
import { PlayerChecker } from "./players-checker";
import cron from "node-cron";

export class Cron {
  public static start() {
    const time = "*/150 * * * * *";
    // console.log(cron.validate(time));
    const pc = new PlayerChecker(minimumPlayersNotification);
    cron.schedule(time, () => {
      clientLogger("Players checker started.");
      pc.check().finally(() => {
        clientLogger("Players checker ended.");
      });
    });
  }
}
