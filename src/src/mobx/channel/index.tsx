import { ChannelMobx } from "globals";
import { makeAutoObservable, computed, action, flow } from "mobx";
import GroupApi from "~/api/remote/GroupApi";
import { RoleType, CheckBoxType } from "~/models/commonTypes";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import { AssignedCheckList, Assignee } from "~/models/task";
import { UserProfileModel, USER_PROFILE_SAMPLE } from "~/models/user";
import GroupService from "~/services/group";
import uuid from "react-native-uuid";
import Toast from "react-native-root-toast";
import { ToastMessage } from "~/constants/ToastMessage";

interface Props {
  groupId: string;
  currentUser: UserProfileModel;
  channelId?: string;
}

export class AddChannelScreenState {
  // UI/UX State
  screenType: ChannelMobx.ScreenType = "form";
  actionDone: "submit_assingee" | undefined = undefined;

  // Data in needed
  groupData: GroupModel = GROUP_SAMPLE;
  oldChannels: GroupModel[] = [];
  currentUser: UserProfileModel = USER_PROFILE_SAMPLE;
  role: RoleType = RoleType.MENTOR;
  channelId: string | undefined = undefined;

  // Form State
  name: string = "";
  nameError: string = "";
  description: string = "";
  type: "PUBLIC" | "PRIVATE" = "PUBLIC";
  assignees: AssignedCheckList = {
    checkedAll: "checked",
    data: [],
    totalChecked: 0,
  };

  constructor(props: Props) {
    makeAutoObservable(this);
    this.setScreenType("form");
    this.fetchGroupData(props.groupId);
    this.currentUser = props.currentUser;
    this.channelId = props.channelId;
    this.fetchOldChannels(props.groupId);
    props.channelId
      ? this.fetchExistedChannel(props.channelId)
      : this.initCreateMode();

    this.fetchAssingees(props.groupId, props.channelId);
  }

  // Getter
  @computed
  getScreenTitle(): string {
    switch (this.screenType) {
      case "select_assignee":
        return "Chọn thành viên";
      default:
        return this.channelId ? "Chỉnh sửa kênh" : "Tạo kênh mới";
    }
  }

  @computed
  getCanGoBack() {
    if (Boolean(this.nameError)) {
      return false;
    }
    return true;
  }

  @action
  initCreateMode() {
    this.name = "";
    this.description = "";
  }

  @action
  initUpdateMode(data: GroupModel) {
    this.name = data.name;
    this.description = data.description || "";
  }

  @action
  setName(text: string) {
    if (Boolean(text) && Boolean(this.nameError)) {
      this.setNameError("");
    }
    this.name = text;
  }

  @action
  setNameError(text: string) {
    this.nameError = text;
  }

  @action
  setDescription(text: string) {
    this.description = text;
  }

  @action
  setGroupData(groupData: GroupModel) {
    this.groupData = groupData;
  }

  @action
  setScreenType(type: ChannelMobx.ScreenType) {
    this.screenType = type;
  }

  @action
  setActionDone(action: "submit_assingee" | undefined) {
    this.actionDone = action;
  }

  @action
  setType(type: "PUBLIC" | "PRIVATE") {
    this.type = type;
  }

  @action
  setAssignee(data: AssignedCheckList) {
    this.assignees = { ...data };
  }

  setOldChannels(data: GroupModel[]) {
    this.oldChannels = data;
  }

  @action
  submit() {
    switch (this.screenType) {
      case "form":
        this.submitForm();
        break;
      case "select_assignee":
        this.setActionDone("submit_assingee");
        break;
      default:
        break;
    }
  }

  @action
  submitForm() {
    const valid: boolean = Boolean(this.name);
    if (!Boolean(this.name)) {
      this.setNameError("Không để trống tên kênh.");
    }

    if (!valid) {
      return;
    }

    const isExisted = this.oldChannels.findIndex(
      channel => channel.name == this.name,
    );
    if (!this.channelId && isExisted > -1) {
      this.setNameError("Tên kênh đã được sử dụng.");
      return;
    }

    const requestData = {
      channelName: this.name,
      description: this.description,
      groupId: this.groupData.id,
      creatorId: this.currentUser.id,
      type: this.assignees.checkedAll == "checked" ? "PUBLIC" : "PRIVATE",
      userIds: this.assignees.data
        .filter(item => item.assigned === "checked")
        .map(item => item.id),
    };

    this.channelId
      ? this.updateChannel(this.channelId, requestData)
      : this.addNewChannel(requestData);
  }

  @action
  submitAssignees(data: AssignedCheckList) {
    if (data.totalChecked < 2) {
      Toast.show(ToastMessage.channelMiniumMember, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      return false;
    }
    this.setAssignee(data);
    this.setScreenType("form");
    this.setActionDone(undefined);
    return true;
  }

  @flow
  private async fetchGroupData(groupId: string) {
    try {
      const data = await GroupService.findById(groupId);
      this.setGroupData(data);
    } catch (error) {
      console.log("@MOBX_CHANNEL_ERORR_fetchGroupData: ", error);
    }
  }

  @flow
  private async fetchExistedChannel(channelId: string) {
    try {
      const data = await GroupApi.findById(channelId);
      this.initUpdateMode(data);
    } catch (error) {
      console.log("@MOBX_TASK_ERORR: ", error);
    }
  }

  @flow
  private async fetchAssingees(groupId: string, channelId: string | undefined) {
    try {
      const groupMember = await GroupService.getMembers(groupId);
      const assignees: Assignee[] = channelId
        ? await GroupApi.getChannelMembers(channelId)
        : [];

      const formatAssignees: Assignee[] = groupMember.map(item => {
        const isJoinned = assignees.findIndex(_item => _item.id === item.id);

        const assigned: CheckBoxType =
          assignees.length === 0
            ? "checked"
            : isJoinned >= 0
            ? "checked"
            : "unchecked";

        return {
          id: item.id,
          name: item.name,
          status: isJoinned >= 0 ? assignees[isJoinned].status : "TO_DO",
          assigned: assigned,
        } as Assignee;
      });

      const assigneeCheckList: AssignedCheckList = {
        data: formatAssignees,
        totalChecked:
          assignees.length == 0 ? formatAssignees.length : assignees.length,
        checkedAll:
          assignees.length === formatAssignees.length || assignees.length === 0
            ? "checked"
            : "unchecked",
      };
      this.setAssignee(assigneeCheckList);
    } catch (error) {
      console.log("@MOBX_CHANNEL_ERORR_fetchAssingees", error);
    }
  }

  @flow
  private async fetchOldChannels(groupId: string) {
    try {
      const channels = await GroupApi.getChannels(groupId);
      this.setOldChannels(channels);
    } catch (error) {
      console.log("@MOBX_CHANNEL_ERORR_fetchOldChannels", error);
    }
  }

  @flow
  private async addNewChannel(requestData: any) {
    await GroupApi.addChannel(requestData);
  }

  @flow
  private async updateChannel(channelId: string, requestData: any) {
    await GroupApi.updateChannel(channelId, requestData);
  }
}
