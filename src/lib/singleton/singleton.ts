import { PlayersInput } from "../utils/data-avarage";
import { RevalidateCache } from "./revalidate-cache";

class Singleton {
  private static instance: Singleton | null = null;
  private static data: PlayersInput[] = [];
  private static start: string = "";
  private static end: string = "";
  private static lastUpdate: string;

  public set(data: PlayersInput[], start: string, end: string) {
    Singleton.data = data;
    Singleton.start = start;
    Singleton.end = end;

    Singleton.lastUpdate = new Date().toLocaleTimeString("he-il", {
      timeZone: "Asia/Jerusalem",
    });
  }

  public async getData(): Promise<any> {
    if (Singleton.lastUpdate === undefined) {
      await RevalidateCache.revalidateCachedLogs();
    }

    return {
      start: Singleton.start,
      end: Singleton.end,
      data: Singleton.data,
    };
  }

  public static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }
}

export const localCache = Singleton.getInstance();
