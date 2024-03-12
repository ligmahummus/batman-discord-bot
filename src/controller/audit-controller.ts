import { Router } from "express";
import { localCache } from "../lib/singleton/singleton";
const router = Router();

router.get("/", async (_, res) => {
  try {
    // Get the data from the singleton,
    // if it's not there, it will revalidate the cache and return the data.
    const response = await localCache.getData();

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Couldn't get audits" });
  }
});

export default router;
