import { createConnection, Connection } from "mysql2";

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
  private static instance: Connection | null = null;

  public static getInstance() {
    if (this.instance === null) {
      this.instance = createConnection({
        host: ADDR,
        user: USER,
        password: PWD,
        database: "fpadb",
      });
      return this.instance;
    } else {
      return this.instance;
    }
  }
}
