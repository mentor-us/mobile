import { ShortProfileUserModel, UserProfileModel } from "~/models/user";
import axiosClient from "./AxiosClient";
import TryCatchWrapper from "~/utils/TryCatchWrapper";
import { PaginationData } from "~/models/commonTypes";

const UserApiV2 = {
  async getCurrentUser() {
    const response = await axiosClient.get<UserProfileModel>("/api/users/me");
    return response.data;
  },

  async findById(id: string) {
    const response = await axiosClient.get(`/api/users/${id}`);
    return response.data;
  },

  async updateProfile(data: UserProfileModel) {
    const response = await axiosClient.patch(
      `api/users/${data.id}/profile`,
      data,
    );
    return response.data;
  },

  // Find mentees
  findMentees: async (
    query: string,
    page = 0,
    pageSize = 25,
  ): Promise<PaginationData<ShortProfileUserModel>> => {
    return axiosClient.get(`/api/users/mentees`, {
      params: { query, page, pageSize },
    });
  },

  findByEmail: async (email: string): Promise<UserProfileModel[]> => {
    const response = await axiosClient.get(`api/users/allByEmail`, {
      params: {
        email: email,
      },
    });
    return response.data;
  },
};

export default TryCatchWrapper(UserApiV2, "UserApiV2");
