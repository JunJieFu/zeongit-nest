 insert into zeongit_account_nest.`user`(
 id,
 create_date,
 update_date,
 phone,
 password,
 state)
 select
 id,
 create_date,
 last_modified_date as update_date,
 phone,
 password,
 state
 from zeongit_account.`user`;

 insert into zeongit_account_nest.`user_info`(
 id,
 create_date,
 update_date,
 state,
 user_id,
 gender,
 birthday,
 nickname,
 introduction,
 country,
 province,
 city,
 avatar,
 background,
 user_state)
 select
 id,
 create_date,
 last_modified_date as update_date,
 state,
 user_id,
 gender,
 birthday,
 nickname,
 introduction,
 country,
 province,
 city,
 avatar_url as avatar,
 background,
 state as user_state
 from zeongit_account.`user_info`;


insert into zeongit_beauty_nest.`picture`
(
id,
create_date,
update_date,
created_by,
url,
name,
introduction,
privacy,
state,
life,
width,
height,
aspect_ratio
) select
id,
create_date,
last_modified_date as update_date,
created_by,
url,
name,
introduction,
privacy,
state,
life,
width,
height,
aspect_ratio
from zeongit_beauty.`picture`;


insert into zeongit_beauty_nest.`tag`
(
id,
create_date,
update_date,
created_by,
name,
picture_id
) select
id,
create_date,
last_modified_date as update_date,
created_by,
name,
picture_id
from zeongit_beauty.`tag`;

insert into zeongit_beauty_admin_nest.`pixiv_work`
(
id,
create_date,
update_date,
illust_id,
illust_title,
pixiv_id,
title,
illust_type,
x_restrict,
pixiv_restrict,
sl,
description,
tags,
translate_tags,
user_id,
user_name,
width,
height,
page_count,
bookmarkable,
ad_container,
pixiv_create_date,
pixiv_update_date,
original_url,
download
) select
id,
create_date,
last_modified_date,
illust_id,
illust_title,
pixiv_id,
title,
illust_type,
x_restrict,
pixiv_restrict,
sl,
description,
tags,
translate_tags,
user_id,
user_name,
width,
height,
page_count,
bookmarkable,
ad_container,
produce_date,
update_date,
original_url,
download
from beauty_admin.`pixiv_work`;


insert into zeongit_beauty_admin_nest.`pixiv_work_detail`
(
id,
create_date,
update_date,
pixiv_id,
name,
url,
proxy_url,
x_restrict,
pixiv_restrict,
width,
height,
download,
pixiv_using
) select
id,
create_date,
last_modified_date,
pixiv_id,
name,
url,
proxy_url,
x_restrict,
pixiv_restrict,
width,
height,
download,
pixiv_using
from beauty_admin.`pixiv_work_detail`;
