
# 200 : OK
# 400 : Nonexistent email

create procedure `confirm_email`(
  in in_id varchar(20)
) BEGIN

  declare result smallint;

  if not exists(select id from user_info where id = in_id) then
    set result = 400;
  else
    set result = 200;
    update user_info set confirmed = true where id = in_id;
  end if;

  select result as "result";
END;