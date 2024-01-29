import {Theme, AppLanguage} from "~/models/commonTypes";

export interface UserSettingModel {
  themeMode: Theme;
  appLanguage: AppLanguage;
}

export interface UserProfileModel {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  phone: string;
  birthDate: string;
  personalEmail: string;
  gender: number;
  emailVerified?: boolean;
  wallpaper?: string;
  additionalEmails?: string[]
}

export interface ShortProfileUserModel {
  id: string;
  name: string;
  imageUrl: string;
}

export const USER_PROFILE_SAMPLE: UserProfileModel = {
  id: "",
  email: "",
  emailVerified: false,
  imageUrl: "",
  name: "Trống",
  birthDate: "",
  gender: 0,
  personalEmail: "",
  phone: "",
};

export const SHORT_PROFILE_USER_MODEL: ShortProfileUserModel = {
  id: "",
  name: "",
  imageUrl: ""
}
