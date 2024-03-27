import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "@env";
import { SecureStore } from "../local/SecureStore";
import LOG from "~/utils/Logger";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getToken();
    config.headers = config.headers ?? {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  error => {
    LOG.error(axiosClient.name.toUpperCase(), error);
    return Promise.reject(error);
  },
);

const createAxiosResponseInterceptor = onUnauthorizeCallback => {
  const interceptor = axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response.data;
    },
    async (error: AxiosError) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error?.response?.status === 401) {
        axiosClient.interceptors.response.eject(interceptor);
        onUnauthorizeCallback();
        // Auto Remove Token
        await SecureStore.removeToken();
      }
      return Promise.reject(error);
    },
  );
};

// Add a response interceptor
export { createAxiosResponseInterceptor };

export default axiosClient;
