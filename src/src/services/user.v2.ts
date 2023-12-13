import UserApiV2 from "~/api/remote/UserApi.v2";
import { UserProfileModel } from "~/models/user";
import TryCatchWrapper from "~/utils/TryCatchWrapper";

const UserServiceV2 = {
  async getCurrentUser() {
    const data = await UserApiV2.getCurrentUser();
    if (data) {
      return {
        ...data,
        imageUrl:
          data.imageUrl === "https://graph.microsoft.com/v1.0/me/photo/$value"
            ? ""
            : data.imageUrl,
      };
    }

    return {} as UserProfileModel;
  },

  async findById(id: string) {
    const data = await UserApiV2.findById(id);
    return data;
  },
};

export default TryCatchWrapper(UserServiceV2, "UserServiceV2");
