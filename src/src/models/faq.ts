import {GroupModel, GROUP_SAMPLE, GROUP_SAMPLE_MENTOR} from "./group";
import {CheckBoxType} from "./commonTypes";
import { SHORT_PROFILE_USER_MODEL, ShortProfileUserModel } from "./user";

export interface FaqModel {
  id: string;
  question: string;
  answer: string;
  group: GroupModel;
  status?: CheckBoxType;
  creator: ShortProfileUserModel;
  createdDate: Date;
  voters: string[];
}

export interface FaqImportList {
  checkedAll: CheckBoxType;
  data: FaqModel[];
  totalChecked: number;
}

export const FAQ_IMPORT_LIST_SAMPLE: FaqImportList = {
  checkedAll: "unchecked",
  data: [],
  totalChecked: 0,
};

export const FAQ_SAMPLE: FaqModel = {
  id: "",
  question: "",
  answer: "",
  group: GROUP_SAMPLE, //GROUP_SAMPLE_MENTOR,
  creator: SHORT_PROFILE_USER_MODEL,
  createdDate: new Date(),
  voters: [],
};

export const GROUP_FAQ_SAMPLE: FaqModel[] = [
  {
    id: "1",
    question: "Trống",
    answer: "",
    group: GROUP_SAMPLE,
    creator: SHORT_PROFILE_USER_MODEL,
    createdDate: new Date(),
    voters: [],
  },
];
