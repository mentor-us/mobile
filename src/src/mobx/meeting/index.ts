import { MeetingMobx } from "globals";
import { action, computed, flow, makeAutoObservable } from "mobx";
import MeetingApi from "~/api/remote/Meeting";
import { CheckBoxType } from "~/models/commonTypes";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import {
  Attendee,
  AttendeeCheckList,
  MeetingModel,
  MeetingRepeatedTypeKeys,
} from "~/models/meeting";
import { UserProfileModel, USER_PROFILE_SAMPLE } from "~/models/user";
import GroupService from "~/services/group";
import MeetingServices from "~/services/meeting";
import Helper from "~/utils/Helper";

interface Props {
  groupId: string;
  currentUser: UserProfileModel;
  meetingId?: string;
}

export class CreateMeetingScreenState {
  // UI/UX State
  screenType: MeetingMobx.ScreenType = "form";
  datePickerStatus: MeetingMobx.DatePickerStatus = "hide";
  actionDone: "submit_group" | "submit_attendeee" | undefined = undefined;

  // Data in needed
  groupData: GroupModel = GROUP_SAMPLE;
  currentUser: UserProfileModel = USER_PROFILE_SAMPLE;
  meetingId?: string;
  canEdit: boolean = false;

  // Form State
  title: string = "";
  titleError: string = "";

  description: string = "";
  place: string = "";
  fromTime: string = "00:00";
  toTime: string = "00:00";
  toTimeError: string = "";

  date: string = "01/09/2001";
  repeatedIndex: number = 1;

  // groups: string[] = [];
  attendees: AttendeeCheckList = {
    checkedAll: "checked",
    data: [
      { id: "1", name: "Lê Văn Định", status: "checked" },
      { id: "2", name: "Trầm Hữu Đức", status: "checked" },
      { id: "3", name: "Nguyễn Nhật Duy", status: "checked" },
    ],
    totalChecked: 3,
  };

  constructor(props: Props) {
    makeAutoObservable(this);
    if (props.groupId == "") {
      this.setScreenType("select_group");
    }
    this.fetchGroupData(props.groupId);
    this.currentUser = props.currentUser;
    this.meetingId = props.meetingId;
    props.meetingId
      ? this.fetchExistedMeeting(props.meetingId)
      : this.initCreateMode();

    this.fetchAttendees(props.groupId, props.meetingId);
  }

  // Getter
  @computed
  getScreenTitle(): string {
    switch (this.screenType) {
      case "form":
        return this.meetingId ? "Chỉnh sửa lịch hẹn" : "Lịch hẹn mới";
      case "select_group":
        return "Chọn nhóm";
      case "select_attendee":
        return "Chọn thành viên";
      default:
        return "Lịch hẹn mới";
    }
  }

  @computed
  getCanGoBack() {
    if (Boolean(this.titleError) || Boolean(this.toTimeError)) {
      return false;
    }
    return true;
  }

  // Setter

  @action
  initCreateMode() {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    this.fromTime = Helper.formatDate(date.toString(), "time");
    date.setMinutes(45);
    this.toTime = Helper.formatDate(date.toString(), "time");
    this.date = Helper.formatDate(date.toString(), "date");
  }

  @action
  initUpdateMode(data: MeetingModel) {
    this.title = data.title;
    this.description = data.description || "";
    this.fromTime = data.time.from;
    this.toTime = data.time.to;
    this.date = data.time.date;
    this.place = data.place || "";
    this.repeatedIndex = MeetingRepeatedTypeKeys.findIndex(
      item => item === data.repeated,
    );
    this.canEdit = data.canEdit;
  }

  @action
  setTitle(text: string) {
    if (Boolean(text)) {
      this.setTitleError("");
    }
    this.title = text;
  }

  @action
  setTitleError(text: string) {
    this.titleError = text;
  }

  @action
  setDescription(text: string) {
    this.description = text;
  }

  @action
  setPlace(text: string) {
    this.place = text;
  }

  @action
  setRepeatedIndex(index: number) {
    this.repeatedIndex = index;
  }

  @action
  setFromTime(date: Date) {
    this.fromTime = Helper.formatDate(date.toString(), "time");
  }

  @action
  setToTime(date: Date) {
    this.toTime = Helper.formatDate(date.toString(), "time");
  }

  @action
  setToTimeError(text: string) {
    this.toTimeError = text;
  }

  @action
  setDate(date: Date) {
    this.date = Helper.formatDate(date.toString(), "date");
  }

  @action
  setDatePickerStatus(status: "from" | "to" | "date" | "hide") {
    this.datePickerStatus = status;
  }

  @action
  setMeetingTime(date: Date) {
    switch (this.datePickerStatus) {
      case "from":
        this.setFromTime(date);
        break;
      case "to":
        this.setToTime(date);
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
  setScreenType(type: MeetingMobx.ScreenType) {
    this.screenType = type;
  }

  @action
  setActionDone(action: "submit_group" | "submit_attendeee" | undefined) {
    this.actionDone = action;
  }

  @action
  setAttendees(data: AttendeeCheckList) {
    this.attendees = { ...data };
  }

  @action
  submit() {
    switch (this.screenType) {
      case "form":
        this.submitForm();
        break;
      case "select_group":
        this.setActionDone("submit_group");
        break;
      case "select_attendee":
        this.setActionDone("submit_attendeee");
        break;
      default:
        break;
    }
  }

  /**
   * 
    "attendees":[
      "*"
   ],
   "groupId":"63f74a7cfc73ec6683c2d227",
   "organizerId":"640562155c787c20d83009fb",
   "description":"Hôm nay bùn, lên tâm sự không ae!",
   "place":"KHTN linh trung",
   "repeated":"EVERY_DAY",
   "timeEnd":"2023-03-18T15:57:28.133Z",
   "timeStart":"2023-03-18T15:57:28.133Z",
   "title":"Họp lớp thui nào"
   */

  @action
  submitForm() {
    const valid: boolean =
      Boolean(this.title) &&
      Helper.isValidMeetingTime(this.fromTime, this.toTime);
    if (!Boolean(this.title)) {
      this.setTitleError("Chưa có tiêu đề");
    }

    if (!Helper.isValidMeetingTime(this.fromTime, this.toTime)) {
      this.setToTimeError("Lỗi");
    } else {
      this.setToTimeError("");
    }

    if (!valid) {
      return;
    }

    const requestData = {
      attendees: this.attendees.data
        .filter(item => item.status === "checked")
        .map(item => item.id),
      groupId: this.groupData.id,
      organizerId: this.currentUser.id,
      description: this.description,
      place: this.place,
      repeated: MeetingRepeatedTypeKeys[this.repeatedIndex],
      timeEnd: Helper.createDateTime(`${this.toTime} - ${this.date}`),
      timeStart: Helper.createDateTime(`${this.fromTime} - ${this.date}`),
      title: this.title,
    };

    this.meetingId
      ? this.updateMeeting(requestData)
      : this.createNewMeeting(requestData);
  }

  @action
  submitGroup(groupId: string) {
    this.fetchGroupData(groupId);
    this.fetchAttendees(groupId, undefined);
    this.setScreenType("form");
    this.setActionDone(undefined);
  }

  @action
  submitAttendee(data: AttendeeCheckList) {
    this.setAttendees(data);
    this.setScreenType("form");
    this.setActionDone(undefined);
  }

  @flow
  private async fetchGroupData(groupId: string) {
    try {
      const data = await GroupService.findById(groupId);
      this.setGroupData(data);
    } catch (error) {
      console.log("@MOBX_MEETING_ERORR", error);
    }
  }

  @flow
  private async fetchAttendees(groupId: string, meetingId: string | undefined) {
    try {
      const groupMember = await GroupService.getMembers(groupId);

      const attendees = meetingId
        ? await MeetingServices.getMeetingAttendees(meetingId)
        : [];

      const formatAttendess: Attendee[] = groupMember
        .map(item => {
          const isJoinned = attendees.findIndex(_item => _item.id === item.id);
          const status: CheckBoxType =
            attendees.length === 0
              ? "checked"
              : isJoinned >= 0
              ? "checked"
              : "unchecked";

          return {
            id: item.id,
            name: item.name,
            status: status,
          } as Attendee;
        })
        .filter(item => {
          return item.id !== this.currentUser.id;
        });

      const attendeeCheckList: AttendeeCheckList = {
        data: formatAttendess,
        totalChecked:
          attendees.length == 0 ? formatAttendess.length : attendees.length,
        checkedAll:
          attendees.length === formatAttendess.length || attendees.length === 0
            ? "checked"
            : "unchecked",
      };
      this.setAttendees(attendeeCheckList);
    } catch (error) {
      console.log("@MOBX_MEETING_ERORR", error);
    }
  }

  @flow
  private async fetchExistedMeeting(meetingId: string) {
    try {
      const data = await MeetingServices.getMeetingDetail(meetingId);
      this.initUpdateMode(data);
    } catch (error) {
      console.log("@MOBX_MEETING_ERROR: ", error);
    }
  }

  @flow
  private async createNewMeeting(requestData: any) {
    await MeetingApi.createMeeting(requestData);
  }

  @flow
  private async updateMeeting(requestData: any) {
    if (this.meetingId) {
      await MeetingApi.updateMeeting(this.meetingId, requestData);
    }
  }
}
