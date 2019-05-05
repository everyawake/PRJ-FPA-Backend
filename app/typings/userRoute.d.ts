declare namespace UserRouter {
  interface ISignInReturnParams {
    id: string;
    email: string;
    username: string;
    device_uuid: string;
    role: number;
    fcm_token: string;
    confirmed: boolean;
    fingerauth_enable: boolean;
    result: number;
  }
}
