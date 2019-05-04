create procedure `get_my_data`(
  in in_id varchar(20)
) BEGIN
  select id, email, username, device_uuid, role, fcm_token, confirmed from user_info where id = in_id;
END;
