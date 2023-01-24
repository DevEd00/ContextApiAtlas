export interface ApiType {
  path: string;
  auth_url: string;
  auth_base_url: string;
  refresh_url: string;
  url?: string;
  storageKey?: string;
  accessTokenKey?: string;
  refreshTokenKey?: string;
  usernameField?: string;
  passwordField?: string;
}
export interface AuthType {
  strategy?: string;
  email?: string;
  phone?: string;
  password?: string;
}
