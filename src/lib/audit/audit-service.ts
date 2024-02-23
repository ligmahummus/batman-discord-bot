import mongoose from "mongoose";
import { clientLogger } from "../utils/util";
import auditConfig from "./audit-config";
import Audit from "./model/audit-model";

export default class AuditService {
  public static connect() {
    clientLogger("Connecting to audit service...");
    if (!auditConfig.mongoUri) throw new Error("Mongo URI is not defined");

    mongoose
      .connect(auditConfig.mongoUri)
      .then(() => {
        clientLogger("Connected to audit service");
      })
      .catch((err) => {
        clientLogger("Error connecting to audit service\n" + err);
      });
  }

  public static async log(players: number) {
    const now = new Date();
    clientLogger(`Logging audit for ${players} players at ${now}.`);
    await this.saveAudit(players, now.toString());
  }

  private static async saveAudit(
    players: number,
    time: string
  ): Promise<boolean> {
    try {
      const newAudit = new Audit({
        players,
        time,
      });

      const savedAudit = await newAudit.save({ new: true });
      clientLogger(`Audit saved id \"${savedAudit._id}\".`);
      return true;
    } catch (err) {
      clientLogger("Error saving audit\n" + err);
      return false;
    }
  }

  public static disconnect() {
    clientLogger("Disconnecting from audit service...");
    mongoose
      .disconnect()
      .then(() => clientLogger("Disconnected from audit service."));
  }
}
