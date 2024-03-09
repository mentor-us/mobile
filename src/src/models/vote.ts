import { CheckBoxType } from "./commonTypes";
import { ShortProfileUserModel, USER_PROFILE_SAMPLE } from "./user";

export interface Vote {
  id: string;
  question: string;
  choices: Choice[];
  groupId: string;
  creatorId: string;
  timeEnd: string;
  createdDate: string;
  closedDate: string;
  status: "OPEN" | "CLOSED";
}

export interface Choice {
  id: string;
  name: string;
  voters: string[];
}

export const NEW_VOTE_SAMPLE: Vote = {
  id: "",
  creatorId: "",
  createdDate: "",
  question: "",
  choices: [
    { id: "1", name: "", voters: [] },
    { id: "2", name: "", voters: [] },
  ],
  groupId: "",
  timeEnd: "",
  status: "OPEN",
  closedDate: "",
};

export interface VoteDetail {
  id: string;
  question: string;
  choices: ChoiceDetail[];
  groupId: string;
  creator: ShortProfileUserModel;
  timeEnd: string;
  createdDate: string;
  status: "OPEN" | "CLOSED";
  closedDate: string;
  canEdit: boolean;
  isMultipleChoice: boolean;
}

export interface ChoiceDetail {
  id: string;
  name: string;
  voters: ShortProfileUserModel[];
}

export interface VoteResult extends VoteDetail {
  choiceResult: ChoiceResult[];
}

export interface ChoiceResult extends ChoiceDetail {
  status: CheckBoxType;
}

export const EMPTY_VOTE_DETAIL = {
  id: "",
  question: "",
  choices: [],
  groupId: "",
  creator: USER_PROFILE_SAMPLE,
  timeEnd: "",
  createdDate: "",
  status: "OPEN",
  closedDate: "",
  canEdit: false,
} as VoteDetail;

export const EMPTY_VOTE_RESULT = {
  id: "",
  question: "",
  choices: [],
  groupId: "",
  creator: USER_PROFILE_SAMPLE,
  timeEnd: "",
  createdDate: new Date().toString(),
  status: "OPEN",
  closedDate: "",
  choiceResult: [],
  canEdit: false,
} as VoteResult;
