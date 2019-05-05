import crypto from "crypto";
import MysqlBase from "./mysqlBase";

const KEY_GEN_SALT = process.env.KEY_GEN_SALT || "";
if (!KEY_GEN_SALT) {
  throw new Error("Need KEY_GEN_SALT!!");
}

export const addThirdApp = (params: {
  name: string;
  id: string;
  siteUrl: string;
}) => {
  return new Promise<{ result: number }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { name, id, siteUrl } = params;
    const plainData = JSON.stringify(params);
    const secretKey = generateKey(plainData);
    const publicKey = generateKey(plainData, true);

    mysqlConn.query(
      "call add_third_app(?, ?, ?, ?, ?)",
      [secretKey, publicKey, name, siteUrl, id],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] addThirdApp(): \n", err);
          mysqlConn.end();
          return;
        }

        resolve(JSON.parse(JSON.stringify(result))[0][0]);
        mysqlConn.end();
      },
    );
  });
};

export const regeneratePublicKey = (params: {
  publicKey: string;
  id: string;
}) => {
  return new Promise<{ result: -1 | 200 }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id, publicKey } = params;
    const plainData = JSON.stringify(params);
    const regeneratedPublicKey = generateKey(plainData, true);

    mysqlConn.query(
      "update provider set public_key = ? where owner = ? and public_key = ?",
      [regeneratedPublicKey, id, publicKey],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] regeneratePublicKey(): \n", err);
          mysqlConn.end();
          return;
        }

        const affectedRows = JSON.parse(JSON.stringify(result))["affectedRows"];
        if (affectedRows > 0) {
          resolve({
            result: 200,
          });
        } else {
          resolve({
            result: -1,
          });
        }
        mysqlConn.end();
      },
    );
  });
};

function generateKey(dataString: string, enableRandomByte: boolean = false) {
  try {
    const salt = enableRandomByte
      ? crypto.randomBytes(64).toString("base64")
      : KEY_GEN_SALT;
    const key = crypto.pbkdf2Sync(dataString, salt, 10000, 64, "sha512");
    return key.toString("base64");
  } catch (err) {
    throw new Error("Failed to key generating");
  }
}
