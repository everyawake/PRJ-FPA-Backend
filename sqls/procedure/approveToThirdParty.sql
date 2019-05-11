CREATE PROCEDURE `approve_to_thirdparty`(
in in_provider_key varchar(300),
in in_user_id varchar(20),
in in_token text
)
BEGIN
	if exists (select idx from provide_token where target_service = in_provider_key and user = in_user_id)
    then
		select 404 as 'result';
	else
		insert into provide_token(target_service, user, token, delete_flag) value (
			in_provider_key,
            in_user_id,
            in_token,
            false
        );
		select 200 as 'result';
    end if;
END
