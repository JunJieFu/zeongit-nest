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
