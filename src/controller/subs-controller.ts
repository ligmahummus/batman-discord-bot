import { Router } from "express";
import { SubscriberService } from "../lib/subscribe/subscriber.service";
const router = Router();

router.get("/", async (_, res) => {
  try {
    const subs = await SubscriberService.getSubscribersByUsername();
    res.status(200).json({ data: subs });
  } catch (error) {
    res.status(500).json({ data: [] });
  }
});

export default router;
