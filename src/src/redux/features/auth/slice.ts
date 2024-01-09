import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {AuthModel} from "~/models/auth";
import {AuthExtraReducer} from "./thunk";

const INITIAL_STATE: AuthModel = {
  token: "",
  refreshToken: "",
  tokenStatus: "verifying",
};

const authSlice = createSlice({
  name: "@AUTH",
  initialState: INITIAL_STATE,
  reducers: {
    logout: (state: AuthModel) => {
      return {
        token: "",
        refreshToken: "",
        tokenStatus: "inactived",
      } as AuthModel;
    },
    login: (state: AuthModel, action: PayloadAction<AuthModel>) => {
      return action.payload;
    },
  },
  extraReducers: AuthExtraReducer,
});

export const AuthActions = authSlice.actions;

const authReducer = authSlice.reducer;

/**
 * @deprecated will be removed in the future - use 'authStore' instead
 */
export default authReducer;
