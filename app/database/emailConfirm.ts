import MysqlBase from "./mysqlBase";

const emailConfirm = (params: { id: string }) => {
  return new Promise<{ result: -1 | 200 | 400 }>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id } = params;

    mysqlConn.query("call confirm_email(?)", [id], (err, result) => {
      if (err) {
        resolve({ result: -1 });
        console.error("[ERR] eamilConfirm(): \n", err);
        mysqlConn.end();
        return;
      }
      resolve(JSON.parse(JSON.stringify(result))[0][0]);
      mysqlConn.end();
    });
  });
};

export default emailConfirm;
