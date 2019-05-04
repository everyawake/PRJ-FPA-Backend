
# 200 : OK
# 400 : incorrect input
# 400 is If the ID does not match the password and the ID does not exist
create procedure `sign_in`(
  in in_id varchar(20),
  in in_password varchar(30),
  in in_ip varchar(100)
) BEGIN

  declare result smallint;
  declare sha256PW varchar(64);

  set sha256PW = SHA2(in_password, 256);

  insert into login_log(user, last_login_ip) value(in_id, in_ip);

  if not exists(select id from user_info where id = in_id) then
    set result = 400;
  elseif not exists(select password from user_info where id = in_id and password = sha256PW) then
    set result = 400;
  else
    set result = 200;
    select id, email, username, device_uuid, role, fcm_token, confirmed, result as "result" from user_info where id = in_id;
  end if;

  select result as "result";
END;
