import { TaskMobx } from "globals";
import { action, computed, flow, makeAutoObservable } from "mobx";
import TaskApi from "~/api/remote/TaskApi";
import { CheckBoxType, RoleType } from "~/models/commonTypes";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import { AssignedCheckList, Assignee, TaskModel } from "~/models/task";
import {
  UserProfileModel,
  USER_PROFILE_SAMPLE,
  ShortProfileUserModel,
  SHORT_PROFILE_USER_MODEL,
} from "~/models/user";
import GroupService from "~/services/group";
import TaskServices from "~/services/task";
import Helper from "~/utils/Helper";

interface Props {
  groupId: string;
  currentUser: UserProfileModel;
  taskId?: string;
}

export class CreateTaskScreenState {
  // UI/UX State
  screenType: TaskMobx.ScreenType = "form";
  datePickerStatus: TaskMobx.DatePickerStatus = "hide";
  actionDone: "submit_group" | "submit_assingee" | undefined = undefined;

  // Data in needed
  groupData: GroupModel = GROUP_SAMPLE;
  currentUser: UserProfileModel = USER_PROFILE_SAMPLE;
  taskId?: string;
  role: RoleType = RoleType.MENTEE;

  // Form State
  title = "";
  titleError = "";

  description = "";
  descriptionError = "";

  time = "22:45";
  date = "01/09/2023";

  // groups: string[] = [];
  assigner: ShortProfileUserModel = SHORT_PROFILE_USER_MODEL;

  assignees: AssignedCheckList = {
    checkedAll: "checked",
    data: [],
    totalChecked: 0,
  };

  constructor(props: Props) {
    makeAutoObservable(this);
    if (props.groupId === "") {
      this.setScreenType("select_channel");
    }
    this.fetchGroupData(props.groupId);
    this.currentUser = props.currentUser;
    this.taskId = props.taskId;

    props.taskId ? this.fetchExistedTask(props.taskId) : this.initCreateMode();

    this.fetchAssingees(props.groupId, props.taskId);
  }

  // Getter
  @computed
  getScreenTitle(): string {
    switch (this.screenType) {
      case "form":
        return this.taskId ? "Chỉnh sửa công việc" : "Công việc mới";
      case "select_channel":
        return "Chọn kênh";
      case "select_assignee":
        return "Chọn thành viên";
      default:
        return "Công việc mới";
    }
  }

  @computed
  getCanGoBack() {
    if (this.titleError) {
      return false;
    }
    return true;
  }

  @computed
  isCanEdit() {
    return (
      this.role === RoleType.MENTOR ||
      this.assigner?.id === this.currentUser?.id
    );
  }

  @computed
  getCurrentTaskStatus() {
    return "NULL";
  }

  // Setter
  @action
  initCreateMode() {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setHours(22);
    date.setMinutes(45);
    this.time = Helper.formatDate(date.toString(), "time");
    this.date = Helper.formatDate(date.toString(), "date");
  }

  @action
  initUpdateMode(data: TaskModel) {
    this.title = data.title;
    this.description = data.description || "";
    this.time = data.deadlineTimeModel.time;
    this.date = data.deadlineTimeModel.date;
    this.role = data.role;
    this.assigner = data.assigner;
  }

  @action
  setTitle(text: string) {
    if (text && this.titleError) {
      this.setTitleError("");
    }

    if (text.length > 100) {
      this.setTitleError("Tiêu đề không được quá 100 ký tự");
    }

    this.title = text;
  }

  @action
  setTitleError(text: string) {
    this.titleError = text;
  }

  @action
  setDescription(text: string) {
    if (this.descriptionError) {
      this.setDescriptionError("");
    }

    if (text.length > 250) {
      this.setDescriptionError("Mô tả không được vượt quá 250 ký tự");
    }

    this.description = text;
  }

  @action
  setDescriptionError(text: string) {
    this.descriptionError = text;
  }

  @action
  setTime(date: Date) {
    this.time = Helper.formatDate(date.toString(), "time");
  }

  @action
  setDate(date: Date) {
    this.date = Helper.formatDate(date.toString(), "date");
  }

  @action
  setDatePickerStatus(status: TaskMobx.DatePickerStatus) {
    this.datePickerStatus = status;
  }

  @action
  setTaskTime(date: Date) {
    switch (this.datePickerStatus) {
      case "time":
        this.setTime(date);
        break;
      case "date":
        this.setDate(date);
        break;
      default:
        break;
    }
  }

  @action
  setGroupData(groupData: GroupModel) {
    this.groupData = groupData;
  }

  @action
  setScreenType(type: TaskMobx.ScreenType) {
    this.screenType = type;
  }

  @action
  setActionDone(action: "submit_group" | "submit_assingee" | undefined) {
    this.actionDone = action;
  }

  @action
  setAssignee(data: AssignedCheckList) {
    this.assignees = { ...data };
  }

  @action
  submit() {
    switch (this.screenType) {
      case "form":
        this.submitForm();
        break;
      case "select_channel":
        this.setActionDone("submit_group");
        break;
      case "select_assignee":
        this.setActionDone("submit_assingee");
        break;
      default:
        break;
    }
  }

  // {
  //   "deadline": "2023-03-18T14:21:45.871Z",
  //   "description": "string",
  //   "groupId": "string",
  //   "parentTask": "string",
  //   "title": "string",
  //   "userIds": [
  //     "string"
  //   ]
  // }

  @action
  isValidData() {
    if (Helper.isBlank(this.title)) {
      this.setTitleError("Tiêu đề không được để trống");
      return false;
    }

    return !this.titleError && !this.descriptionError;
  }

  @action
  submitForm() {
    if (!this.isValidData()) {
      return;
    }

    const requestData = {
      userIds: this.assignees.data
        .filter(item => item.assigned === "checked")
        .map(item => item.id),
      groupId: this.groupData.id,
      organizerId: this.currentUser.id,
      description: this.description,
      deadline: Helper.createDateTime(`${this.time} - ${this.date}`),
      title: this.title.trim(),
    };

    this.taskId
      ? this.updateTask(requestData)
      : this.createNewTask(requestData);
  }

  @action
  submitGroup(groupId: string) {
    this.fetchGroupData(groupId);
    this.fetchAssingees(groupId, undefined);
    this.setScreenType("form");
    this.setActionDone(undefined);
  }

  @action
  submitAssignees(data: AssignedCheckList) {
    this.setAssignee(data);
    this.setScreenType("form");
    this.setActionDone(undefined);
  }

  @flow
  private async fetchGroupData(groupId: string) {
    try {
      const data = await GroupService.findById(groupId);
      this.setGroupData(data);
    } catch (error) {
      console.log("@MOBX_TASK_ERORR_fetchGroupData: ", error);
    }
  }

  @flow
  private async fetchAssingees(groupId: string, taskId: string | undefined) {
    try {
      const groupMember = await GroupService.getMembers(groupId);
      const assignees: Assignee[] = taskId
        ? await TaskServices.getTaskAssinees(taskId)
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
      console.log("@MOBX_TASK_ERORR_fetchAssingees", error, taskId);
    }
  }

  @flow
  private async fetchExistedTask(taskId: string) {
    try {
      const data = await TaskServices.getTaskDetail(taskId);
      this.initUpdateMode(data);
    } catch (error) {
      console.log("@MOBX_TASK_ERORR: ", error);
    }
  }

  @flow
  private async createNewTask(requestData: any) {
    await TaskApi.createTask(requestData);
  }

  @flow
  private async updateTask(requestData: any) {
    if (this.taskId) {
      await TaskApi.updateTask(this.taskId, requestData);
    }
  }
}
