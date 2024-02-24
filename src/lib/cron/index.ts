import { clientLogger } from "../utils/util";
import { PlayerChecker } from "../check-players/players-checker.service";
import cron from "node-cron";

export class Cron {
  private static state: boolean = true;

  public static start() {
    if (!this.state) return clientLogger("Cron job service is OFF", "warn");

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
