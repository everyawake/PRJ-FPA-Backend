interface ITokenData {
  id: string;
  email: string;
  username: string;
  device_uuid: string;
  role: number;
  fcm_token: string;
  confirmed: boolean;
  fingerauth_enable: boolean;
}

interface IEmailTokenData {
  email: string;
  username: string;
  id: string;
}

interface IThirdPartySimpleInformation {
  name: string;
  site_url: string;
  owner: string;
  secret_key: string;
}
