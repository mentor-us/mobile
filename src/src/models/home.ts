import {GroupModel, GROUP_SAMPLE} from "./group";
import {MeetingModel, MEETING_SAMPLE} from "./meeting";
import {TaskModel} from "./task";

export interface HomePageContentModel {
  events: (MeetingModel | TaskModel)[];
  // pinnedGroups: GroupModel[];
  groups: {data: GroupModel[]; last: boolean};
}

export const HOME_PAGE_SAMPLE: HomePageContentModel = {
  events: [],
  // pinnedGroups: [GROUP_SAMPLE, GROUP_SAMPLE, GROUP_SAMPLE],
  groups: {
    data: [],
    last: true,
  },
};
