import { Axios, AxiosResponse } from "axios";
import { UserProfileModel } from "~/models/user";
import axiosClient from "./AxiosClient";
import { ToastEmail } from "~/constants/AddEmail";

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
      return error;
    }
  },
  updateLinkMail: async (id: string, email: string) => {
    try {
      const URL = `api/users/${id}/email/add`;
      const response: any = await axiosClient.post(URL, {
        additionalEmail: email,
      });

      return ToastEmail[response.returnCode];
    } catch (error) {
      console.log("@API_USER_updateLinkMail_ERROR: ", error);
      return ToastEmail["error"];
    }
  },
  deleteLinkMail: async (id: string, email: string) => {
    try {
      const URL = `api/users/${id}/email/remove`;
      const response: any = await axiosClient.delete(URL, {
        data: { additionalEmail: email },
      });
      return response.message;
    } catch (error) {
      console.log("@API_USER_updateLinkMail_ERROR: ", error);
      return "Xóa email liên kết thất bại!";
    }
  },
};

export default UserApi;
