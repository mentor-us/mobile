import { AxiosResponse } from "axios";
import axiosClient from "./AxiosClient";

const GradeApi = {
  getAllGrade: async params => {
    const URL = "/api/grades";
    try {
      const response: AxiosResponse = await axiosClient.get(URL, {
        params,
      });
      return response;
    } catch (error) {
      console.log("@API_ERROR_getHomePageData: ", error);
    }
  },
};

export default GradeApi;
