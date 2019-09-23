import express from "express";
import jwt from "jsonwebtoken";
import { getMyData } from "../database";

const SIGN_KEY = process.env.FPA_SIGN_KEY;
if (!SIGN_KEY) {
  throw new Error("Should set FPA_SIGN_KEY!!");
}

const fpaTokenAuthenticator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userToken = req.header("fpa-authenticate-token");
  if (!userToken) {
    res.status(400).json({
      result: "Need token"
    });
    return;
  }

  try {
    const verifiedTokenData = jwt.verify(userToken, SIGN_KEY) as any;
    getMyData({
      id: verifiedTokenData.id
    })
      .then(result => {
        if (result.result === -1) {
          res.status(400).json({
            result: "Invalid token"
          });
          return;
        } else {
          req.body.userTokenData = result.result;
          next();
        }
      })
      .catch(err => {
        res.status(400).json({
          result: "Invalid token",
          error: err
        });
        return;
      });
  } catch (err) {
    res.status(400).json({
      result: "Invalid token",
      error: err
    });
    return;
  }
};

const fpaTokenSign = (data: ITokenData) => {
  return jwt.sign({ data }, SIGN_KEY, { expiresIn: "30d" });
};

export { fpaTokenSign };

export default fpaTokenAuthenticator;
