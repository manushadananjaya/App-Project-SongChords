import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let refreshTokenPromise: Promise<any> | null = null;

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenPromise = refreshAccessToken(refreshToken);
        }

        try {
          const newToken = await refreshTokenPromise;
          isRefreshing = false;
          setAccessToken(newToken.accessToken);
          originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
          return axios(originalRequest as AxiosRequestConfig);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

async function getAccessToken(): Promise<string | null> {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user).accessToken : null;
}

async function getRefreshToken(): Promise<string | null> {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user).refreshToken : null;
}

async function setAccessToken(token: string): Promise<void> {
  const user = await AsyncStorage.getItem("user");
  if (user) {
    const newUser = JSON.parse(user);
    newUser.accessToken = token;
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  } else {
    await AsyncStorage.setItem("user", JSON.stringify({ accessToken: token }));
  }
}

async function refreshAccessToken(refreshToken: string): Promise<any> {
  try {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default apiClient;