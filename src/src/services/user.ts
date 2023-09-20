import UserApi from "~/api/remote/UserApi";
import {UserProfileModel, USER_PROFILE_SAMPLE} from "~/models/user";

const UserService = {
  getCurrentUser: async (): Promise<UserProfileModel> => {
    try {
      const data: UserProfileModel | undefined = await UserApi.getCurrentUser();

      if (data) {
        return {
          ...data,
          imageUrl:
            data.imageUrl === "https://graph.microsoft.com/v1.0/me/photo/$value"
              ? ""
              : data.imageUrl,
        };
      }

      return USER_PROFILE_SAMPLE;
    } catch (error) {
      return USER_PROFILE_SAMPLE;
    }
  },

  findById: async (id: string): Promise<UserProfileModel> => {
    try {
      const data: UserProfileModel | undefined = await UserApi.findById(id);
      if (data) {
        return data;
      }
      return USER_PROFILE_SAMPLE;
    } catch (error) {
      console.log("SERVIVES_ERROR: ", error);
      return USER_PROFILE_SAMPLE;
    }
  },
};

export default UserService;
