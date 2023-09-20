import {Action, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserProfileModel, USER_PROFILE_SAMPLE} from "~/models/user";
import {UserExtraReducer} from "./thunk";

export interface InitialState {
  data: UserProfileModel;
}

const INITIAL_STATE: InitialState = {
  data: USER_PROFILE_SAMPLE,
};

const userSlice = createSlice({
  name: "@USER",
  initialState: INITIAL_STATE,
  reducers: {
    // updateProfile: (
    //   state: InitialState,
    //   action: PayloadAction<UserProfileModel>,
    // ) => {
    //   state.data = action.payload;
    // },
    updateAvatar: (state: InitialState, action: PayloadAction<string>) => {
      return {
        data: {
          ...state.data,
          imageUrl: action.payload,
        },
      };
    },
    updateWallpaper: (state: InitialState, action: PayloadAction<string>) => {
      return {
        data: {
          ...state.data,
          wallpaper: action.payload,
        },
      };
    },
  },
  extraReducers: UserExtraReducer,
});

export const UserActions = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
