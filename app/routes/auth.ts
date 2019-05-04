import express from "express";
import fpaTokenMiddleware, {
  fpaTokenSign,
} from "../helpers/fpaTokenMiddleware";
import { getMyData } from "../database";

const router = express.Router();

router.get("/", fpaTokenMiddleware, async (req, res) => {
  const { id } = req.body.userTokenData.data as ITokenData;

  const result = await getMyData({ id });
  if (result.result === -1) {
    res.status(400).json({
      result: "no data",
    });
  } else {
    res.status(200).json(result);
  }
});

router.post("/regenerate", fpaTokenMiddleware, async (req, res) => {
  const { id } = req.body.userTokenData.data as ITokenData;

  const result = await getMyData({ id });
  if (result.result === -1) {
    res.status(400).json({
      result: "no data",
    });
  } else {
    const newToken = fpaTokenSign(result.result as ITokenData);
    res.status(200).json({
      token: newToken,
      data: result.result,
    });
  }
});

export default router;
