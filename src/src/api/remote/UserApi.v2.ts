import { UserProfileModel } from "~/models/user";
import axiosClient from "./AxiosClient";
import TryCatchWrapper from "~/utils/TryCatchWrapper";

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
};

export default TryCatchWrapper(UserApiV2, "UserApiV2");
