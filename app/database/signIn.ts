import MysqlBase from "./mysqlBase";

// # 100: email already exists
// # 101: id already exists
// # 200 : OK
const signIn = (params: {
  id: string;
  password: string;
}) => {
  return new Promise<{ result: number }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id, password } = params;

    mysqlConn.query(
      "call sign_in(?,?);",
      [id, password],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] signIn(): \n", err);
          mysqlConn.end();
          return;
        }
        resolve(JSON.parse(JSON.stringify(result))[0][0]);
        mysqlConn.end();
      },
    );
  });
};

export default signIn;
