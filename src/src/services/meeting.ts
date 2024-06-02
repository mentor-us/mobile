import MeetingApi from "~/api/remote/Meeting";
import { RoleType, SchedulesList } from "~/models/commonTypes";
import { GroupMemberModel, GROUP_MEMBER_SAMPLE } from "~/models/group";
import { MeetingModel, MeetingHistory, MEETING_SAMPLE } from "~/models/meeting";
import Helper from "~/utils/Helper";

const MeetingServices = {
  getGroupMeeting: async (groupId: string): Promise<SchedulesList> => {
    try {
      const data: any = await MeetingApi.getGroupMeeting(groupId);
      if (data && data.length) {
        const formatData: MeetingModel[] = data.map((item: MeetingModel) => {
          return {
            ...item,
            time: Helper.getTimeMeeting(item.timeStart, item.timeEnd),
          } as MeetingModel;
        });

        formatData.sort((a, b) => {
          const left = new Date(a.timeStart);
          const right = new Date(b.timeStart);
          return right.getTime() - left.getTime();
        });

        const current = new Date();

        const result: SchedulesList = {
          upcoming: formatData.filter(item => {
            const date = new Date(item.timeEnd);
            return date.getTime() >= current.getTime();
          }),
          passed: formatData.filter(item => {
            const date = new Date(item.timeEnd);
            return date.getTime() < current.getTime();
          }),
        };
        return result;
      }

      return {
        upcoming: [],
        passed: [],
      };
    } catch (error) {
      return {
        upcoming: [],
        passed: [],
      };
    }
  },

  getMeetingDetail: async (meetingId: string): Promise<MeetingModel> => {
    try {
      const data: MeetingModel | undefined = await MeetingApi.getMeetingDetail(
        meetingId,
      );

      if (!data) {
        return MEETING_SAMPLE;
      }

      var dataHistory: any = data.histories;

      const formatHistory: MeetingHistory[] = dataHistory.map(
        (item: any, index) => {
          return {
            ...item,
            time: Helper.formatDate(item.modifyDate, "datetime"),
            title: index == 0 ? "Tạo lịch hẹn" : "Dời lịch hẹn",
            description:
              "Bởi " +
              item.modifier.name +
              ".\n" +
              Helper.getTimeMeeting(item.timeStart, item.timeEnd).display +
              ".",
          } as MeetingHistory;
        },
      );

      return {
        ...data,
        time: Helper.getTimeMeeting(data.timeStart, data.timeEnd),
        group: data.group || "",
        organizer: data.organizer || "",
        histories: formatHistory,
      } as MeetingModel;
    } catch (error) {
      console.log("@SERVICES_ERROR_MeetingApi_getMeetingDetail: ", error);
      return MEETING_SAMPLE;
    }
  },

  getMeetingAttendees: async (
    meetingId: string,
  ): Promise<GroupMemberModel[]> => {
    try {
      const data: any = await MeetingApi.getMeetingAttendees(meetingId);

      if (data) {
        const formatData: GroupMemberModel[] = data.map(item => {
          return {
            ...item,
            role: item.mentor === false ? RoleType.MENTEE : RoleType.MENTOR,
          } as GroupMemberModel;
        });

        return formatData;
      }

      return [];
    } catch (error) {
      return [];
    }
  },

  fulfillMeetingTime: (meeting: any): MeetingModel => {
    return {
      ...meeting,
      time: Helper.getTimeMeeting(
        meeting?.timeStart || "",
        meeting?.timeEnd || "",
      ),
      organizer: {
        name: "System",
      },
    } as MeetingModel;
  },
};

export default MeetingServices;
