import Audit from "../audit/model/audit-model";
import { DataAvarage, PlayersInput } from "../utils/data-avarage";
import { localCache } from "./singleton";
export class RevalidateCache {
  public static async revalidateCachedLogs(): Promise<boolean> {
    try {
      let result: {
        start: string;
        end: string;
        data: PlayersInput[];
      } = {
        start: "",
        end: "",
        data: [],
      };
      const audits = await Audit.find().select({ _id: 0, __v: 0 });
      result.data = DataAvarage.avarage(audits);
      result.start = audits[0].time;
      result.end = audits[audits.length - 1].time;

      // Cache it in the singleton
      localCache.set(result.data, result.start, result.end);
      return true;
    } catch (error) {
      return false;
    }
  }
}
