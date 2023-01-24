import {
  URL_AUTHENTICATION,
  URL_BASE_API,
  URL_CURRENT_USER,
  URL_REFRESH_TOKEN,
} from "../../constants";
import { AuthType } from "api/api.dto";
import { Api } from "../Api";
const app = new Api({
  path: URL_BASE_API,
  auth_url: URL_AUTHENTICATION,
  refresh_url: URL_REFRESH_TOKEN,
  usernameField: "username",
});
export const getService = (service: string) => {
  return app.service(service);
};
export const authenticate = ({
  strategy = "local",
  email,
  password,
  ...params
}: Partial<AuthType>) => {
  return app.authenticate({
    strategy,
    email,
    password,
    ...params,
  });
};
export const reAuthenticate = () => {
  return app.reAuthenticate();
};
export const signOut = () => {
  app.signOut();
};
export const current = () => app.service(URL_CURRENT_USER).find({});
