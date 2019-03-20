
# 100: email already exists
# 101: id already exists
# 200 : OK
#
create procedure `sign_up`(
  in in_id varchar(20),
  in in_email varchar(320),
  in in_username varchar(30),
  in in_password varchar(30),
  in in_device_uuid text,
  in in_fcm_token text
) BEGIN

  declare result smallint;

  if exists(select email from user_info where email = in_email) then
    set result = 100;
  elseif exists(select id from user_info where id = in_id) then
    set result = 101;
  else
    insert into user_info(id, email, username, password, device_uuid, fcm_token)
     value(in_id, in_email, in_username, SHA2(in_password, 256), in_device_uuid, in_fcm_token);
    set result = 200;
  end if;

  select result as "result";
END;
