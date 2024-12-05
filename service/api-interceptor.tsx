import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "@/store/storage";
import { logout } from "./auth-service";

export const apiAxios = axios.create({
  baseURL: BASE_URL,
});

export const refreshTokens = async () => {
  try {
    const refreshToken = await tokenStorage.getItem("refresh_token");
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });
    const accessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token;
    await Promise.all([
      tokenStorage.setItem("access_token", accessToken),
      tokenStorage.setItem("refresh_token", newRefreshToken),
    ]);
    return accessToken;
  } catch (error) {
    console.log("REFRESH TOKEN ERROR", error);
    logout();
  }
};

apiAxios.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const accessToken = await refreshTokens();
        if (accessToken) {
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log("ERROR REFRESING TOKEN", error);
      }
    }
    return Promise.reject(error);
  }
);
