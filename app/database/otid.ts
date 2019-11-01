import shortid from "shortid";
import MysqlBase from "./mysqlBase";

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#");

type ErrorResult = { result: -1 };
type SuccessResult = { result: 200; data: { otid?: string; id?: string; user?: string } };

const generateOTID = (params: { id: string }) => {
  return new Promise<ErrorResult | SuccessResult>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { id } = params;
    const expiredAt = Date.now() / 1000 + 60; // Add 1minute
    const otid = shortid().slice(0, 5); // shortid로 부터 만들어지 문자열을 앞에서 5자 자르기

    // 위에서 만든 otid를 db에 유저id랑 otid를 등록
    mysqlConn.query("call generate_otid(?, ?, ?);", [otid, id, expiredAt], (err, result) => {
      if (err) {
        resolve({ result: -1 });
        console.error("[ERR] generateOTID(): \n", err);
        mysqlConn.end();
        return;
      }

      const affectedRows = JSON.parse(JSON.stringify(result))["affectedRows"];
      if (affectedRows > 0) {
        resolve({
          result: 200,
          data: {
            otid
          }
        });
      } else {
        resolve({
          result: -1
        });
      }
      mysqlConn.end();
    });
  });
};

const getUserIdByOTID = (params: { otid: string }) => {
  return new Promise<ErrorResult | SuccessResult>(resolve => {
    const mysqlConn = MysqlBase.getInstance();
    const { otid } = params;

    mysqlConn.query("select * from user_otid where otid = ?", [otid], (err, result) => {
      if (err) {
        resolve({ result: -1 });
        console.error("[ERR] getUserIdByOTID(): \n", err);
        mysqlConn.end();
        return;
      }

      const data = JSON.parse(JSON.stringify(result))[0];
      resolve({
        result: 200,
        data
      });
    });
  });
};

export { generateOTID, getUserIdByOTID };
