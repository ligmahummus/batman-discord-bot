import { Z_ASCII } from "zlib";
import { PlayerCount } from "./rp.service.type";

/**
 * Returns the current and total player count from the RP website.
 */
export async function playerCount(serverIp: string): Promise<RPServer | null> {
  try {
    const serversMasterList: Promise<RPServerResponse> = await fetch(
      "https://cdn.rage.mp/master"
    ).then((res) => res.json());
    const server = serversMasterList[serverIp];
    return server;
  } catch (error) {
    return null;
  }
}
// play.eclipse-rp.lt:22010

interface RPServerResponse {
  [key: string]: RPServer;
}

type RPServer = {
  name: string;
  players: number;
  peak: number;
  maxplayers: number;
  lang: string;
  url: string;
  gamemode: string;
};
