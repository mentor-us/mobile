import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {AuthApi} from "~/api/local";
import {AuthModel} from "~/models/auth";

const login = createAsyncThunk(
  "@auth/login",
  async (data: AuthModel): Promise<AuthModel> => {
    const isSaved =
      (await AuthApi.saveToken(data.token)) &&
      (await AuthApi.saveRefreshToken(data.refreshToken));

    if (isSaved) {
      return data;
    }

    return {
      token: "",
      refreshToken: "",
      tokenStatus: "inactived",
    };
  },
);

const logout = createAsyncThunk("@auth/logout", async (): Promise<boolean> => {
  const isSaved = await AuthApi.saveToken("");
  return isSaved;
});

const verifyToken = createAsyncThunk(
  "@auth/verifyToken",
  async (): Promise<AuthModel> => {
    const token = await AuthApi.getToken();
    const refreshToken = await AuthApi.getRefreshToken();

    if (token) {
      return {
        token,
        refreshToken,
        tokenStatus: token ? "actived" : "inactived",
      };
    }
    return {token: "", refreshToken: "", tokenStatus: "inactived"};
  },
);

export const AuthExtraReducer = (
  builder: ActionReducerMapBuilder<AuthModel>,
) => {
  builder
    .addCase(login.fulfilled, (state, action: PayloadAction<AuthModel>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenStatus = "actived";
    })
    .addCase(logout.fulfilled, (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.token = "";
        state.tokenStatus = "inactived";
      }
    })
    .addCase(
      verifyToken.fulfilled,
      (state, action: PayloadAction<AuthModel>) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenStatus = action.payload.tokenStatus;
      },
    );
};

const AuthThunk = {
  login,
  logout,
  verifyToken,
};

export default AuthThunk;
