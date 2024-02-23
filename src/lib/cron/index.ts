import { clientLogger } from "../utils/util";
import { PlayerChecker } from "./players-checker";
import cron from "node-cron";

export class Cron {
  public static start() {
    const time = `*/15 * * * *`;

    const pc = new PlayerChecker();
    cron.schedule(time, () => {
      const start = Date.now();
      clientLogger("Players checker started.");
      pc.check().finally(() => {
        clientLogger(
          `Players checker ended and it took ${
            (Date.now() - start) / 1000
          } seconds.`
        );
      });
    });
  }
}
