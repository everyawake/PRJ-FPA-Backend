// Ref. https://express-validator.github.io/docs/custom-error-messages.html

import express from "express";
import { check, validationResult } from "express-validator";
import {
  signUp,
  signIn,
  updateFingerAuthAbility,
  changeUserMode,
} from "../database";
import { sendWelcomeMail } from "../helpers/email/emailHelper";
import fpaTokenMiddleware, {
  fpaTokenSign,
} from "../helpers/fpaTokenMiddleware";
import { USER_ROLE_TYPE } from "../database/myInformation";

const router = express.Router();

router.get("/:username/hello", (req, res) => {
  const username = req.params.username;
  res.json({
    username: `Hello! nice to meet U!, ${username} :)`,
  });
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  res.json({
    username: `'${username}' Hello!`,
  });
});

router.post(
  "/signup",
  [
    check("id").exists(),
    check("username").exists(),
    check("device_uuid").exists(),
    check("fcm_token").exists(),
    check("email").isEmail(),
    check("password").isLength({ min: 4, max: 20 }),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const result = await signUp(req.body);

    switch (result.result) {
      case 200: {
        const { id, email, username, device_uuid, fcm_token } = req.body;
        sendWelcomeMail({ to: email, username, id });

        const newToken = fpaTokenSign({
          id,
          email,
          username,
          device_uuid,
          role: 9999,
          fcm_token,
          confirmed: false,
          fingerauth_enable: false,
        });
        return res.status(201).json({
          token: newToken,
        });
      }

      default: {
        return res.status(422).json(result);
      }
    }
  },
);

router.post(
  "/signin",
  [check("id").exists(), check("password").isLength({ min: 4, max: 20 })],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const result = await signIn({ ...req.body, ip });

    switch (result.result) {
      case 200: {
        const newObject = { ...result } as UserRouter.ISignInReturnParams;
        delete newObject.result;
        const newToken = fpaTokenSign(newObject);
        return res.status(200).json({
          token: newToken,
          data: newObject,
        });
      }

      default: {
        return res.status(422).json(result);
      }
    }
  },
);

router.put(
  "/fingerprintAbility",
  fpaTokenMiddleware,
  [
    check("featureAbility")
      .exists()
      .isBoolean(),
    check("userTokenData").exists(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const uid = req.body.userTokenData.data.id;
    const fingerAuthAbility = req.body.featureAbility;

    const result = await updateFingerAuthAbility({
      id: uid,
      fingerAuthAbility,
    });

    switch (result.result) {
      case 200: {
        return res.status(200).json({ result: "updated" });
      }

      default: {
        return res.status(401).json({ result: "Couldn't update..." });
      }
    }
  },
);

router.put(
  "/privilege-developer",
  fpaTokenMiddleware,
  [check("userTokenData").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const uid = req.body.userTokenData.data.id;
    const result = await changeUserMode({
      id: uid,
      role: USER_ROLE_TYPE.THIRD_PARTY_DEVELOPER,
    });

    switch (result.result) {
      case 200: {
        return res.status(200).json({ result: "updated" });
      }

      default: {
        return res.status(401).json({ result: "Couldn't update..." });
      }
    }
  },
);

router.put(
  "/privilege-admin",
  fpaTokenMiddleware,
  [check("userTokenData").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id: uid, role } = req.body.userTokenData.data as ITokenData;

    if (role != 1) {
      return res.status(401).json({ result: "You can not pass!" });
    }

    const result = await changeUserMode({
      id: uid,
      role: USER_ROLE_TYPE.ADMIN,
    });

    switch (result.result) {
      case 200: {
        return res.status(200).json({ result: "updated" });
      }

      default: {
        return res.status(401).json({ result: "Couldn't update..." });
      }
    }
  },
);

export default router;
