import axios from "axios";
import { ApiType } from "./api.dto";
export class Api {
  static accessToken: string = "";
  static refreshToken: string = "";
  request: any;
  path: string;
  auth_url: string;
  auth_base_url: string;
  refresh_url: string;
  url: string = "";
  storageKey: string = "user";
  accessTokenKey: string = "authorization";
  refreshTokenKey: string = "refresh_token";
  usernameField: string = "email";
  passwordField: string = "password";

  constructor({
    path,
    auth_url,
    refresh_url,
    storageKey,
    accessTokenKey,
    refreshTokenKey,
    usernameField,
    passwordField,
    auth_base_url
  }: ApiType) {
    if (!path) throw new Error("Base path service not found");

    this.request = this.request = axios.create({
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
      baseURL: path,
    });

    this.path = path;
    this.auth_url = auth_url;
    this.refresh_url = refresh_url;
    this.storageKey = storageKey || this.storageKey;
    this.accessTokenKey = accessTokenKey || this.accessTokenKey;
    this.refreshTokenKey = refreshTokenKey || this.refreshTokenKey;
    this.usernameField = usernameField || this.usernameField;
    this.passwordField = passwordField || this.passwordField;
    Api.accessToken = window.localStorage.getItem(this.accessTokenKey) || "";
    Api.refreshToken = window.localStorage.getItem(this.refreshTokenKey) || "";
  }
  authenticate(params: any) {
    const self = this;
    let { auth_url, accessTokenKey, storageKey, usernameField, passwordField,  } =
      this;
    let { strategy } = params;
    return new Promise(async (resolve, reject) => {
      try {
        if (!auth_url) reject("Auth URL is required");
        let { data } = await self.request.post(auth_url, {
          [usernameField]: params[usernameField],
          [passwordField]: params[passwordField],
          strategy,
        });
        let accessToken = data[accessTokenKey] || data["accessToken"];
        let refreshToken = data[this.refreshTokenKey];
        if (accessToken) {
          Api.accessToken = accessToken;
          Api.refreshToken = refreshToken;
          self.request.defaults.headers.common["Authorization"] =
            Api.accessToken;
          window.localStorage.setItem(this.refreshTokenKey, refreshToken);
          window.localStorage.setItem(this.accessTokenKey, accessToken);
        }
        if (data[storageKey])
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(data[storageKey])
          );
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
  reAuthenticate() {
    let { refreshTokenKey, accessTokenKey, storageKey, refresh_url } = this;
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        if (!Api.accessToken)
          reject(`${this.refreshTokenKey} not found in localStorage.`);
        self.request.defaults.headers.common["Authorization"] = Api.accessToken;
        let { data } = await self.request.post(`/${refresh_url}`, {
          [refreshTokenKey]: Api.refreshToken,
        });
        let accessToken = data[accessTokenKey] || data["accessToken"];
        let refreshToken = data[this.refreshTokenKey];
        if (accessToken) {
          Api.accessToken = accessToken;
          Api.refreshToken = refreshToken;
          this.request.defaults.headers.common["Authorization"] =
            Api.accessToken;
          window.localStorage.setItem(this.refreshTokenKey, refreshToken);
          window.localStorage.setItem(this.accessTokenKey, accessToken);
        }
        if (data[storageKey])
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(data[storageKey])
          );
        resolve(data);
      } catch (err) {
        console.log("ERROR:", err);
        reject(err);
      }
    });
  }
  signOut() {
    window.localStorage.removeItem(this.refreshTokenKey);
    window.localStorage.removeItem(this.refreshTokenKey);
    window.localStorage.removeItem(this.storageKey);
  }
  service(service: string) {
    if (!service) throw new Error("service not defined");
    this.url = service;
    return this;
  }
  find = async ({ query = {} }: any) => {
    const self = this;
    let { url } = this;
    let params = {
      ...query,
    };
    return new Promise(async (resolve, reject) => {
      try {
        let { data } = await self.request.get(`/${url}`, {
          params,
        });
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  remove = async (id: number) => {
    let { url } = this;
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) reject("id not found");
        let data = await self.request.delete(`/${url}/${id}`);
        if (Array.isArray(data)) return resolve(data);
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  get = async (id: number) => {
    let { url } = this;
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) reject("id not found");
        let { data } = await self.request.get(`/${url}/${id}`);
        if (Array.isArray(data)) return resolve(data);
        return resolve(data);
      } catch (err: any) {
        reject(err);
      }
    });
  };
  patch = async (id: number, params: any = {}) => {
    let { url } = this;
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) reject("id not found");
        let { data } = await self.request.patch(`/${url}/${id}`, params);
        if (Array.isArray(data)) return resolve(data);
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  patchMany = async (params: any = {}) => {
    let { url } = this;
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        let { data } = await self.request.patch(`/${url}`, params);
        if (Array.isArray(data)) return resolve(data);
        return resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  };
  create = async (params: any = {}) => {
    const self = this;
    let { url } = this;
    return new Promise(async (resolve, reject) => {
      try {
        let res = await self.request.post(`/${url}`, params);
        const { data } = res;
        if (Array.isArray(data)) return resolve({ data: data });
        return resolve(data);
      } catch (err: any) {
        const errorMessage = err.response.data?.errors?.[0] || err;
        reject(errorMessage);
      }
    });
  };
}
