use fpadb;

# user table
create table user_info(
  id varchar(20) primary key,
  email varchar(320),
  username varchar(30),
  password varchar(64) not null,# sha256 + some
  confirmed boolean default false,
  device_uuid text, # use mac address
  fcm_token text,
  delete_flag boolean default false
);

create table user_otp (
  user varchar(20) primary key,
  code varchar(4),

  constraint `fk_user_otp_user` foreign key (user) references user_info(id)
);  # server make this code every time

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
