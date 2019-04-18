// Ref. https://express-validator.github.io/docs/custom-error-messages.html

import express from "express";
import { check, validationResult } from "express-validator/check";
import signUp from "../database/signUp";
import { sendUserConfirmationEmail } from "../helpers/email/emailHelper";

const router = express.Router();

router.get("/:username", (req, res) => {
  const username = req.params.username;
  res.json({
    username,
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
        sendUserConfirmationEmail(req.body.email);
        return res.status(201).json(result);
      }

      default: {
        return res.status(422).json(result);
      }
    }
  },
);

export default router;
