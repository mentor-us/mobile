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

export const MAX_SIZE_IMG = 5 * 1000 * 1000;
