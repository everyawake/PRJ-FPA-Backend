CREATE PROCEDURE `add_third_app`(
  in in_secret_key varchar(300),
  in in_public_key varchar(300),
  in in_name varchar(100),
  in in_site_url text,
  in in_owner varchar(20)
)
BEGIN
	if exists (select secret_key from provider where owner = in_owner and `name` = in_name)
  then
		select 301 as 'result';	# 동일한 정보 존재함.
	else
		insert into provider(secret_key, public_key, name, site_url, owner) value(in_secret_key, in_public_key, in_name, in_site_url, in_owner);
    select 200 as 'result';
  end if;
END
