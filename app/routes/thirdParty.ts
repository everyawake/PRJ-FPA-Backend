import express from "express";
import { check, validationResult } from "express-validator";
import fpaTokenMiddleware from "../helpers/fpaTokenMiddleware";
import { addThirdApp, regeneratePublicKey, getUserIdByOTID } from "../database";
import { approveToThirdApp, checkUserApproved } from "../database/thirdParty";

const router = express.Router();

router.post(
  "/new",
  fpaTokenMiddleware,
  [check("userTokenData").exists(), check("appName").exists(), check("siteUrl").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { appName, siteUrl } = req.body;
    const { id, confirmed, role } = req.body.userTokenData.data as ITokenData;

    if (!confirmed || role > 3000) {
      return res.status(401).json({
        result: "You don't have permission"
      });
    } else {
      const result = await addThirdApp({
        name: appName,
        id,
        siteUrl
      });

      switch (result.result) {
        case 200: {
          return res.status(200).json({
            result: "Successfully created!"
          });
        }
        case 301: {
          return res.status(400).json({
            result: "Already have same name"
          });
        }
        default: {
          return res.status(422).json({
            result: "Couldn't connect new third-party app"
          });
        }
      }
    }
  }
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
        result: "You don't have permission"
      });
    } else {
      const result = await regeneratePublicKey({
        id,
        publicKey
      });

      switch (result.result) {
        case 200: {
          return res.status(200).json({
            result: "Successfully regenerated!"
          });
        }
        case -1:
        default: {
          return res.status(422).json({
            result: "Regenerate failed..."
          });
        }
      }
    }
  }
);

router.post(
  "/approve",
  [check("otid").exists(), check("thirdparty-public-key").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const publicKey = req.body["thirdparty-public-key"];
    const otidOwner = await getUserIdByOTID({
      otid: req.body["otid"]
    });

    if (otidOwner.result === -1) {
      return res.status(422).json({ result: "OTID is not valid." });
    }

    const userId = otidOwner.data && otidOwner.data.user;
    if (!userId) {
      return res.status(404).json({ result: "Incorrect OTID" });
    }

    const result = await approveToThirdApp({
      publicKey,
      userId
    });

    switch (result.result) {
      case 200: {
        return res.status(200).json({
          result: "Successfully approved!"
        });
      }
      case 404:
      case -1:
      default: {
        return res.status(422).json({
          result: "Approve failed..."
        });
      }
    }
  }
);

router.post(
  "/user-approved",
  [check("otid").exists(), check("thirdparty-public-key").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const publicKey = req.body["thirdparty-public-key"];
    const otidOwner = await getUserIdByOTID({
      otid: req.body["otid"]
    });

    if (otidOwner.result === -1) {
      return res.status(422).json({ result: "OTID is not valid." });
    }

    const userId = otidOwner.data && otidOwner.data.user;
    if (!userId) {
      return res.status(404).json({ result: "Incorrect OTID" });
    }

    const result = await checkUserApproved({
      publicKey,
      userId
    });

    switch (result.result) {
      case 200: {
        return res.status(200).json({
          result: 200,
          token: result.token
        });
      }
      case 404:
      case -1:
      default: {
        return res.status(404).json({
          result: "User can't found..."
        });
      }
    }
  }
);

export default router;
