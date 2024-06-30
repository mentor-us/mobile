import { AxiosResponse } from "axios";
import axiosClient from "./AxiosClient";

const YearApi = {
  getAllYears: async params => {
    const URL = "/api/years";
    try {
      const response: AxiosResponse = await axiosClient.get(URL, {
        params,
      });
      return response;
    } catch (error) {
      console.log("@API_ERROR_getHomePageData: ", error);
    }
  },
  getAllSemesterOfYear: params => axiosClient.get(`/api/semesters`, { params }),
};

export default YearApi;
