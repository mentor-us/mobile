import {AxiosResponse} from "axios";
import axiosClient from "./AxiosClient";

const ScheduleApi = {
  getSchedulesData: async () => {
    const URL = "/api/events/own";
    try {
      const response: AxiosResponse = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_GETALLSchedule_ERROR: ", error);
    }
  },
  getSchedulesDataDay: async (date: String) => {
    const URL = `/api/events/own/date?date=${date}`;
    try {
      const response: AxiosResponse = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_GETScheduleDate_ERROR: ", error);
    }
  },
  getSchedulesDataMonth: async (date: String) => {
    const URL = `/api/events/own/month?date=${date}`;
    try {
      const response: AxiosResponse = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_GETScheduleMonth_ERROR: ", error);
    }
  },
};

export default ScheduleApi;
