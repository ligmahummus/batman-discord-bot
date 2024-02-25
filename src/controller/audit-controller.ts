import { Router } from "express";
const router = Router();
import Audit from "../lib/audit/model/audit-model";
import { DataAvarage } from "../lib/utils/data-avarage";

router.get("/", async (_, res) => {
  try {
    const audits = await Audit.find().select({ _id: 0, __v: 0 });
    res
      .status(200)
      .json({
        start: audits[0].time,
        end: audits[audits.length - 1].time,
        data: DataAvarage.avarage(audits),
      });
  } catch (error) {
    res.status(500).json({ message: "Couldn't get audits" });
  }
});

export default router;
