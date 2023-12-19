export type PlayerCount = {
  current: string;
  total: string;
};

export interface RPServerResponse {
  [key: string]: RPServer;
}

export type RPServer = {
  name: string;
  players: number;
  peak: number;
  maxplayers: number;
  lang: string;
  url: string;
  gamemode: string;
};
