// Ref. https://express-validator.github.io/docs/custom-error-messages.html

import express from "express";
import { check, validationResult } from "express-validator/check";
import { signUp, signIn } from "../database";
import { sendWelcomeMail } from "../helpers/email/emailHelper";
import { fpaTokenSign } from "../helpers/fpaTokenMiddleware";

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
        sendWelcomeMail(req.body.email, req.body.username);
        return res.status(201).json(result);
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
        const token = fpaTokenSign(newObject);
        return res.status(200).json({
          token,
        });
      }

      default: {
        return res.status(422).json(result);
      }
    }
  },
);

export default router;
