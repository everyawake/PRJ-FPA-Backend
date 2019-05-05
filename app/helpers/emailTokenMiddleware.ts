import express from "express";
import jwt from "jsonwebtoken";

const SIGN_KEY = process.env.FPA_EMAIL_VERIFY_KEY;
if (!SIGN_KEY) {
  throw new Error("Should set FPA_EMAIL_VERIFY_KEY!!");
}

const emailTokenAuthenticator = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const emailToken = req.param("token");
  if (!emailToken) {
    res.status(400).json({
      result: "Need token",
    });
    return;
  }

  try {
    const verifiedTokenData = jwt.verify(emailToken, SIGN_KEY) as any;

    req.body.emailTokenData = verifiedTokenData;
    next();
  } catch (err) {
    res.status(400).json({
      result: "Invalid token",
      error: err,
    });
    return;
  }
};

const emailTokenSign = (data: IEmailTokenData) => {
  return jwt.sign({ data }, SIGN_KEY, { expiresIn: "1h" });
};

export { emailTokenSign };

export default emailTokenAuthenticator;
