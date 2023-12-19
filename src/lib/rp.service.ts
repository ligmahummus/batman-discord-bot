import { Z_ASCII } from "zlib";
import { PlayerCount, RPServer, RPServerResponse } from "./rp.service.type";

/**
 * Returns the current and total player count from the RP website.
 */
export async function playerCount(serverIp: string): Promise<RPServer | null> {
  try {
    const serversMasterList: RPServerResponse = await fetch(
      "https://cdn.rage.mp/master"
    ).then((res) => res.json());
    const server = serversMasterList[serverIp as keyof RPServerResponse];
    if (!server) throw new Error("Server not found");
    return server;
  } catch (error) {
    return null;
  }
}
