export class DataAvarage {
  private static data: PlayersInput[] = [];
  private static runCache: { [key: string]: number } = {};

  public static avarage(data: PlayersInput[]): PlayersInput[] {
    for (let i = 0; i < data.length; i++) {
      const hour = this.getDatesTime(data[i].time);

      const j = this.runCache[hour];
      if (j !== undefined) {
        const players = this.data[j].players;
        this.data[j].players = Math.round((players + data[i].players) / 2);
      } else {
        this.data.push(data[i]);
        this.runCache[hour] = this.data.length - 1;
      }
    }
    const sortedData = this.sortData(this.data);
    return sortedData;
  }

  private static sortData(data: PlayersInput[]): PlayersInput[] {
    return data.sort((a, b) => {
      return new Date(a.time).getHours() - new Date(b.time).getHours();
    });
  }

  private static getDatesTime(date: string): string {
    return new Date(date)
      .toLocaleTimeString("he-il", {
        timeZone: "Asia/Jerusalem",
      })
      .slice(0, 5);
  }
}

export type PlayersInput = {
  players: number;
  time: string;
};
