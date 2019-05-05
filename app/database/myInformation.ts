import MysqlBase from "./mysqlBase";

const getMyData = (params: { id: string }) => {
  return new Promise<{ result: number | ITokenData }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id } = params;

    mysqlConn.query("call get_my_data(?);", [id], (err, result) => {
      if (err) {
        resolve({ result: -1 });
        console.error("[ERR] signIn(): \n", err);
        mysqlConn.end();
        return;
      }
      resolve({
        result: JSON.parse(JSON.stringify(result))[0][0],
      });
      mysqlConn.end();
    });
  });
};

const updateFingerAuthAbility = (params: {
  id: string;
  fingerAuthAbility: boolean;
}) => {
  return new Promise<{ result: number }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id, fingerAuthAbility } = params;

    mysqlConn.query(
      "update user_info set fingerauth_enable = ? where id = ?",
      [fingerAuthAbility, id],
      (err, result) => {
        if (err) {
          resolve({ result: -1 });
          console.error("[ERR] signIn(): \n", err);
          mysqlConn.end();
          return;
        }

        const affectedRows = JSON.parse(JSON.stringify(result))["affectedRows"];
        if (affectedRows === 1) {
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

export { getMyData, updateFingerAuthAbility };
