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

export default getMyData;
