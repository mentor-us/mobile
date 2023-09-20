import {AxiosResponse} from "axios";
import axiosClient from "./AxiosClient";

const HomeApi = {
  getHomePageData: async () => {
    const URL = "/api/groups/home";
    try {
      const response: AxiosResponse = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR_getHomePageData: ", error);
    }
  },
};

export default HomeApi;
