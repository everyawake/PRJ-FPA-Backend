CREATE PROCEDURE `generate_otid`(
  in in_otid varchar(14),
  in in_id varchar(20),
  in in_expiredAt int
)
BEGIN
  if exists (select otid from user_otid where user = in_id)
  then
    delete from user_otid where user = in_id;
    end if;

  insert into user_otid(otid, user, expiredAt) value (in_otid, in_id, in_expiredAt);
END
