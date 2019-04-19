import MysqlBase from "./mysqlBase";

// # 100: email already exists
// # 101: id already exists
// # 200 : OK
const signUp = (params: {
  id: string;
  email: string;
  username: string;
  password: string;
  device_uuid: string;
  fcm_token: string;
}) => {
  return new Promise<{ result: number }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id, email, username, password, device_uuid, fcm_token } = params;

    mysqlConn.query(
      "call sign_up(?,?,?,?,?,?);",
      [id, email, username, password, device_uuid, fcm_token],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] signUp(): \n", err);
          mysqlConn.end();
          return;
        }
        resolve(JSON.parse(JSON.stringify(result))[0][0]);
        mysqlConn.end();
      },
    );
  });
};

export default signUp;
