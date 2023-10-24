import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {AuthApi} from "../local";
import {BASE_URL} from "@env";
import StoreInstance from "~/constants/StorageInstance";
import {AuthActions} from "~/redux/features/auth/slice";
import {Alert} from "react-native";
import RemoteAuthApi from "./RemoteAuthApi";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("@DUKE: BASE_URL: ", BASE_URL);

// const state = AppState.store.getState();
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const token = await AuthApi.getToken();
    config.headers = config.headers ?? {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  error => {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  },
);

const doRefreshToken = async (token: string, refreshToken: string) => {
  const URL = `/api/auth/refresh-token`;
  try {
    const response: AxiosResponse = await axiosClient.post(URL, {
      // accessToken: token,
      // refreshToken: refreshToken,
      token,
    });

    return response;
  } catch (err) {
    const error = err as AxiosError;
    console.log("@ERROR _ AuthApi _ refreshToken: ", error);
    return "";
  }
};

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  async error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {

      const token = await AuthApi.getToken();

      if (!token) {
        StoreInstance.store?.dispatch(AuthActions.logout());
        return;
      }

      const refreshToken = await AuthApi.getRefreshToken();
      const data:any = await doRefreshToken(token, refreshToken);
      
      console.log("@DUKE TOKEN REFRESH: ", {token, refreshToken, data});

      if ( data && data.accessToken ) {
        console.log("@DUKE: call refresh token: ", data);

        StoreInstance.store?.dispatch(
          AuthActions.login({
            token: data.accessToken,
            refreshToken: data.accessToken,
            tokenStatus: "actived",
          }),
        );
        return;
      } else {
        Alert.alert("Thông báo", "Bạn cần đăng nhập lại để tiếp tục", [
          {
            text: "Xác nhận",
            onPress: () => {
              StoreInstance.store?.dispatch(AuthActions.logout());
            },
          },
        ]);
        return Promise.reject(new Error(error.response.status));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
