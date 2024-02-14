import { clientLogger } from "../utils/util";
import { PlayerChecker } from "./players-checker";
import cron from "node-cron";

export class Cron {
  public static start() {
    const halfHour = 60 * 30;
    // const tenSeconds = 10;
    const time = `*/${halfHour} * * * * *`;
    // console.log(cron.validate(time));
    const pc = new PlayerChecker();
    cron.schedule(time, () => {
      clientLogger("Players checker started.");
      pc.check().finally(() => {
        clientLogger("Players checker ended.");
      });
    });
  }
}
