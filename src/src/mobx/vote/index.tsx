import { GROUP_SAMPLE, GroupModel } from "~/models/group";
import { USER_PROFILE_SAMPLE, UserProfileModel } from "~/models/user";

interface Props {
    groupId: string;
    currentUser: UserProfileModel;
    voteId?: string;
}

export class CreateVoteScreenState {

    /* Data in need */
    groupData: GroupModel = GROUP_SAMPLE;
    currentUser: UserProfileModel = USER_PROFILE_SAMPLE;
    meetingId?: string;
    canEdit: boolean = false;

    /* Form state */
    question: string = "";
    timeEnd: string = "00:00";
}