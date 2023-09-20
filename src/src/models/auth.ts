export interface AuthModel {
  token: string;
  refreshToken: string;
  tokenStatus: "verifying" | "inactived" | "actived";
}
