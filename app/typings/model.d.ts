type Id = string;

declare namespace Model {
  interface IRawUserInfo {
    id: Id;
    email: string;
    username: string;
    password: string;
    confirmed: boolean;
    device_uuid: string;
    fcm_token: string;
    delete_flag: boolean;
  }

  interface IUserOTP {
    user: Id;
    code: string;
  }

  interface IRawProvider {
    secret_key: string;
    public_key: string;
    name: string;
    site_url: string;
    owner: Id;
  }

  interface IRawProviderToken {
    target_service: string;
    user: Id;
    token: string;
    issued_date: string;
    delete_flag: boolean;
  }

  interface ILoginLog {
    idx: number;
    user: Id;
    last_login_ip: string;
    issued_timestamp: string;
  }
}
