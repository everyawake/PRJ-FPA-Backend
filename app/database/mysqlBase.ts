import { createConnection, Connection } from "mysql2";

export default class MysqlBase {
  private static instance: Connection | null = null;

  public static getInstance() {
    if (this.instance === null) {
      this.instance = createConnection({
        host: "192.168.64.129", // change when vm changed
        user: "root",
        database: "fpa",
        password: "lee940401",
      });
      return this.instance;
    } else {
      return this.instance;
    }
  }
}
