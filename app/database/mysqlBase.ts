import { createConnection } from "mysql2";

const ADDR = process.env.MYSQL_ADDR
  ? process.env.MYSQL_ADDR.replace("\r", "")
  : "";
const USER = process.env.MYSQL_USER
  ? process.env.MYSQL_USER.replace("\r", "")
  : "";
const PWD = process.env.MYSQL_PWD
  ? process.env.MYSQL_PWD.replace("\r", "")
  : "";

export default class MysqlBase {
  public static getInstance() {
    return createConnection({
      host: ADDR,
      user: USER,
      password: PWD,
      database: "fpadb",
    });
  }
}
