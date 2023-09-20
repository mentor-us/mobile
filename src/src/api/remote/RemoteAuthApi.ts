import {AxiosError, AxiosResponse} from "axios";
import axiosClient from "./AxiosClient";

const RemoteAuthApi = {
  refreshToken: async (token: string, refreshToken: string) => {
    // const URL = `api/auth/refresh-token`;
    // try {
    //   const response: AxiosResponse = await axiosClient.post(URL, {
    //     accessToken: token,
    //     refreshToken: refreshToken,
    //   });

    //   return response;
    // } catch (err) {
    //   const error = err as AxiosError;
    //   console.log("@ERROR _ AuthApi _ refreshToken: ", error);
    //   return "";
    // }
    const URL = `/api/auth/refresh-token`;
    try {
      const response: AxiosResponse = await axiosClient.post(URL, {
        accessToken: token,
        refreshToken: refreshToken,
      });
      return response;
    } catch (err) {
      const error = err as AxiosError;
      console.log("@ERROR _ AuthApi _ refreshToken: ", error);
      return "";
    }
  },
};

export default RemoteAuthApi;
