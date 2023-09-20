import {AxiosResponse} from "axios";
import {UserProfileModel} from "~/models/user";
import axiosClient from "./AxiosClient";

const UserApi = {
  getCurrentUser: async () => {
    const URL = "/api/users/me";
    try {
      const response: AxiosResponse = await axiosClient.get(URL);

      return response.data;
    } catch (error) {
      console.log("@API_USER_ERROR: ", error);
    }
  },

  findById: async (id: string) => {
    try {
      const URL = `/api/users/${id}`;
      const response: AxiosResponse = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_USER_findById_ERROR: ", error);
    }
  },
  updateProfile: async (data: UserProfileModel) => {
    try {
      const URL = `api/users/${data.id}/profile`;
      const response = await axiosClient.patch(URL, data);
    } catch (error) {
      console.log("@API_USER_updateUser_ERROR: ", error);
    }
  },
};

export default UserApi;
