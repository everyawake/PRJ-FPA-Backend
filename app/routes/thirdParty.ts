import express from "express";
import { check, validationResult } from "express-validator/check";
import fpaTokenMiddleware from "../helpers/fpaTokenMiddleware";
import { addThirdApp, regeneratePublicKey } from "../database";

const router = express.Router();

router.post(
  "/new",
  fpaTokenMiddleware,
  [
    check("userTokenData").exists(),
    check("appName").exists(),
    check("siteUrl").exists(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { appName, siteUrl } = req.body;
    const { id, confirmed, role } = req.body.userTokenData.data as ITokenData;

    if (!confirmed || role > 3000) {
      return res.status(401).json({
        result: "You don't have permission",
      });
    } else {
      const result = await addThirdApp({
        name: appName,
        id,
        siteUrl,
      });

      switch (result.result) {
        case 200: {
          return res.status(200).json({
            result: "Successfully created!",
          });
        }
        case 301: {
          return res.status(400).json({
            result: "Already have same name",
          });
        }
        default: {
          return res.status(422).json({
            result: "Couldn't connect new third-party app",
          });
        }
      }
    }
  },
);

router.post(
  "/regenerate-public-key",
  fpaTokenMiddleware,
  [check("userTokenData").exists(), check("publicKey").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { publicKey } = req.body;
    const { id, confirmed, role } = req.body.userTokenData.data as ITokenData;

    if (!confirmed || role > 3000) {
      return res.status(401).json({
        result: "You don't have permission",
      });
    } else {
      const result = await regeneratePublicKey({
        id,
        publicKey,
      });

      switch (result.result) {
        case 200: {
          return res.status(200).json({
            result: "Successfully regenerated!",
          });
        }
        case -1:
        default: {
          return res.status(422).json({
            result: "Regenerate failed...",
          });
        }
      }
    }
  },
);

export default router;
