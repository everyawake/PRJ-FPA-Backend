import express from "express";
import fpaTokenMiddleware, {
  fpaTokenSign,
} from "../helpers/fpaTokenMiddleware";
import emailTokenMiddleware from "../helpers/emailTokenMiddleware";
import { getMyData, emailConfirm } from "../database";
import { check } from "express-validator/check";

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

router.get("/emailConfirmation", emailTokenMiddleware, [check("emailTokenData").exists()], async (req: express.Request, res: express.Response) => {
  const { id } = req.body.emailTokenData.data as IEmailTokenData;

  const result = await emailConfirm({ id });

  switch(result.result) {
    case 200: {
      return res.status(200).json({
        state: "success"
      });
    }

    case 400: {
      return res.status(404).json({
        state: "User not exists"
      });
    }

    case -1:
    default: {
      return res.status(422).json({
        result: "error"
      });
    }
  }
});

export default router;
