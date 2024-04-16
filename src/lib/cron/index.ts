import cron from "node-cron";
import { PlayerChecker } from "../check-players/players-checker.service";
import { RevalidateCache } from "../singleton/revalidate-cache";
import { clientLogger } from "../utils/util";

export class Cron {
  private static state: boolean = true;

  public static start() {
    if (!this.state) return clientLogger("Cron job service is OFF", "warn");

    const time = `*/15 * * * *`;

    cron.schedule(time, () => {
      const start = Date.now();
      try {
        clientLogger("Players checker started.");
        new PlayerChecker()
          .check()
          .then(() => RevalidateCache.revalidateCachedLogs());
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
