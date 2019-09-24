CREATE DEFINER=`fpa`@`%` PROCEDURE `getRegisteredThirdApps` (
in in_id varchar(300)
)
BEGIN
select pt.target_service as 'app_public_key', pv.name, pv.site_url, pt.token, pt.issued_date
from provide_token as pt
left join provider pv on pt.target_service = pv.public_key
where pt.user = in_id and pt.delete_flag = false;
END;
