import { Dimensions } from "react-native";
import { types } from "react-native-document-picker";

export const { width: screenWidth, height: screenHeight } =
  Dimensions.get("window");

import { BASE_URL } from "@env";

export const LinkAuthorize = {
  google: `${BASE_URL}/oauth2/authorize/google?redirect_uri=mentorus://oauth2/redirect`,
  azure: `${BASE_URL}/oauth2/authorize/azure?redirect_uri=mentorus://oauth2/redirect`,
  apple: `${BASE_URL}/oauth2/authorize/apple?redirect_uri=mentorus://oauth2/redirect`,
};

export const KeyBoard_ID = "UNIQUE_KEYBOARD";

export const SpecialCharacter = {
  dot: "•",
};

export const SUPPORT_FILE_TYPES: string[] = [
  types.doc,
  types.docx,
  types.xls,
  types.csv,
  types.xlsx,
  types.ppt,
  types.pptx,
  types.pdf,
];

export const PHONE_NUMBER_REGEX =
  /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/m;

export const SOCKET_EVENT = {
  JOIN_ROOM: "join_room",
  RECEIVE_REACT_MESSAGE: "receive_react_message",
  RECEIVE_REMOVE_REACT_MESSAGE: "receive_remove_react_message",
  RECEIVE_PINNED_MESSAGE: "receive_pinned_message",
  RECEIVE_UNPINNED_MESSAGE: "receive_unpinned_message",
  UPDATE_MESSAGE: "update_message",
  RECEIVE_MESSAGE: "receive_message",
  RECEIVE_VOTING: "receive_voting",
};

export const IMAGE_EXT = [".gif", ".jpg", ".jpeg", ".png"];
export const VIDEO_EXT = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

export const MAX_SIZE_IMG = 10 * 1000 * 1000;
export const MAX_SIZE_VIDEO = 100 * 1000 * 1000;
