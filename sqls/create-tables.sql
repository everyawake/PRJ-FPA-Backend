use fpadb;

create table privilige_role (
  role_id int primary key,
  role_name varchar(25) not null
  );

insert  into privilige_role(role_id, role_name) values(9999, "normal"), (3000, "third-party developer"), (1, "fpa admin");

# user table
create table user_info(
  id varchar(20) primary key,
  email varchar(320),
  username varchar(30),
  password varchar(64) not null,# sha256 + some
  confirmed boolean default false,
  fingerauth_enable boolean default false,
  device_uuid text, # use mac address
  fcm_token text,
  role int,
  delete_flag boolean default false

  constraint `fk_user_privilige` foregin key (role) references privilige_role(role_id)
);

create table login_log (
  idx int auto_increment primary key,
  user varchar(20),
  last_login_ip varchar(100), # ipv4 ipv6
  issued_timestamp timestamp default CURRENT_TIMESTAMP,

  constraint `fk_login_log_user` foreign key (user) references user_info(id)
);

create table provider(
  secret_key varchar(300),
  public_key varchar(300),
  name varchar(100) not null,
  site_url text,
  owner varchar(20),

  index(public_key),
  constraint `pk_provider` primary key (secret_key),
  constraint `fk_provider_user` foreign key (owner) references user_info(id)
);

create table provide_token(
  target_service varchar(300),
  user varchar(20),
  token text,
  issued_date timestamp default CURRENT_TIMESTAMP,
  delete_flag boolean default false,

  constraint `fk_provide_token` foreign key (target_service) references  provider(public_key),
  constraint `fk_provide_token_user` foreign key (user) references user_info(id),
  constraint `pk_provide_token` primary key (target_service, user)
);


create table user_otid (
  otid varchar(14),
  user varchar(20),
  expiredAt int,

  constraint `pk_otid` primary key(otid, user),
  constraint `fk_user_otid` foreign key (user) references user_info(id)
);
