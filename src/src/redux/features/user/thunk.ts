import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import UserApi from "~/api/remote/UserApi";
import {UserProfileModel} from "~/models/user";
import UserService from "~/services/user";
import {InitialState} from "./slice";

const getCurrentUser = createAsyncThunk(
  "@user/getCurrentUser",
  async (): Promise<UserProfileModel> => {
    const currentuser: UserProfileModel = await UserService.getCurrentUser();
    return currentuser;
  },
);

const updateProfile = createAsyncThunk(
  "@user/updateProfile",
  async (data: UserProfileModel) => {
    await UserApi.updateProfile(data);
    return data;
  },
);

export const UserExtraReducer = (
  builder: ActionReducerMapBuilder<InitialState>,
) => {
  builder
    .addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<UserProfileModel>) => {
        state.data = action.payload;
      },
    )
    .addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<UserProfileModel>) => {
        state.data = action.payload;
      },
    );
};

const UserThunks = {
  getCurrentUser,
  updateProfile,
};

export default UserThunks;
