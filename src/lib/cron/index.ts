import cron from "node-cron";
import { PlayerChecker } from "../check-players/players-checker.service";
import { clientLogger } from "../utils/util";

export class Cron {
  private static state: boolean = true;

  public static start() {
    if (!this.state) return clientLogger("Cron job service is OFF", "warn");

    const time = `*/15 * * * *`;

    const pc = new PlayerChecker();
    cron.schedule(time, () => {
      const start = Date.now();
      try {
        clientLogger("Players checker started.");
        const data = pc.check();
      } catch (error) {
        console.error(error);
      } finally {
        clientLogger(
          `Players checker ended and it took ${
            (Date.now() - start) / 1000
          } seconds.`
        );
      }
    });
  }
}
