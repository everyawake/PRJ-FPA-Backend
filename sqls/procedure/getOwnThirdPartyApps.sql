CREATE DEFINER=`fpa`@`%` PROCEDURE `getOwnThirdPartyApps`(
in in_id varchar(300)
)
BEGIN
	select public_key, name, site_url, owner from provider where owner = in_id;
END;
