import crypto from "crypto";
import MysqlBase from "./mysqlBase";

if (!process.env.KEY_GEN_SALT) {
  throw new Error("Need KEY_GEN_SALT!!");
}

// public & secret key 생성기
// public_key = generateKey("<some value>", true);
// secret_key = generateKey("<some value>");
function generateKey(dataString: string, enableRandomByte: boolean = false) {
  try {
    const salt = enableRandomByte
      ? crypto.randomBytes(64).toString("base64") // 64자리 난수 생성 후 base64로 인코딩
      : process.env.KEY_GEN_SALT || "";
    const key = crypto.pbkdf2Sync(dataString, salt, 10000, 64, "sha512");
    return key.toString("base64");
  } catch (err) {
    throw new Error("Failed to key generating");
  }
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

export const approveToThirdApp = (params: {
  publicKey: string;
  userId: string;
}) => {
  return new Promise<{ result: -1 | 404 | 200 }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { publicKey, userId } = params;
    const plainData = JSON.stringify({
      ...params,
      iat: Date.now() / 1000,
    });
    const token = generateKey(plainData, true);

    mysqlConn.query(
      "call approve_to_thirdparty(?, ?, ?)",
      [publicKey, userId, token],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] approveToThirdApp(): \n", err);
          mysqlConn.end();
          return;
        }

        const returnVal = JSON.parse(JSON.stringify(result))[0][0];

        resolve(returnVal);
        mysqlConn.end();
      },
    );
  });
};

export const checkUserApproved = (params: {
  publicKey: string;
  userId: string;
}) => {
  return new Promise<{ result: -1 | 404 } | { result: 200; token: string }>(
    resolve => {
      const mysqlConn = MysqlBase.getInstance();
      const { publicKey, userId } = params;

      mysqlConn.query(
        "select token from provide_token where target_service = ? and user = ?",
        [publicKey, userId],
        (err, result) => {
          if (err) {
            resolve({ result: -1 });
            console.error("[ERR] checkUserApproved(): \n", err);
            mysqlConn.end();
            return;
          }

          const returnVal = JSON.parse(JSON.stringify(result))[0];
          if (returnVal) {
            resolve({
              result: 200,
              token: returnVal.token,
            });
          } else {
            resolve({
              result: 404,
            });
          }

          mysqlConn.end();
        },
      );
    },
  );
};

export const getThirdPartyInformation = (params: { publicKey: string }) => {
  return new Promise<{ result: -1 | 404 } | { result: 200; data: IThirdPartySimpleInformation; }>(
    resolve => {
      const mysqlConn = MysqlBase.getInstance();
      const { publicKey } = params;

      mysqlConn.query(
        "select secret_key, name, site_url, owner from provider where public_key = ?",
        [publicKey],
        (err, result) => {
          if (err) {
            resolve({ result: -1 });
            console.error("[ERR] getThirdPartyInformation(): \n", err);
            mysqlConn.end();
            return;
          }

          const returnVal = JSON.parse(JSON.stringify(result))[0];
          if (returnVal) {
            resolve({
              result: 200,
              data: returnVal,
            });
          } else {
            resolve({
              result: 404,
            });
          }

          mysqlConn.end();
        },
      );
    },
  );
}
