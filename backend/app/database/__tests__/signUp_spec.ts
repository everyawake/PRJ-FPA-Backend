import signUp from "../signUp";
import MysqlBase from "../mysqlBase";

describe("signUp()", () => {
  it("test", async () => {
    MysqlBase.getInstance().query("delete from user_info where id='test02'");
    const result = await signUp({
      id: "test02",
      email: "test02@test.com",
      username: "tester02",
      password: "1111111111",
      device_uuid: "wwwwwww",
      fcm_token: "sddsfsd",
    });

    console.log("!!!result\n", result);
  });
});
