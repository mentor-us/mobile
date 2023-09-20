import ScheduleApi from "~/api/remote/ScheduleApi";
import {Color} from "~/constants/Color";
import {CalendarMode, ScheduleModel} from "~/models/schedule";

const ScheduleServices = {
  getScheduleData: async (): Promise<ScheduleModel[]> => {
    try {
      const data: any = await ScheduleApi.getSchedulesData();

      if (data) {
        const formatData: ScheduleModel[] = formatDataTime(data);
        return formatData.map(item => {
          return {
            ...item,
            color: item.type == "MEETING" ? Color.red : Color.orange,
          };
        });
      }

      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  getScheduleDataMode: async (
    date: string,
    mode: CalendarMode,
  ): Promise<ScheduleModel[]> => {
    try {
      var data: any;
      switch (mode) {
        case "day":
          data = await ScheduleApi.getSchedulesDataDay(date);
          break;
        case "month":
          data = await ScheduleApi.getSchedulesDataMonth(date);
          break;
        case "week":
          data = await ScheduleApi.getSchedulesDataMonth(date);
          break;
        default:
          data = null;
      }
      if (!data) {
        return [];
      }

      const formatData: ScheduleModel[] = formatDataTime(data);
      return formatData;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
};

function formatDataTime(data: ScheduleModel[]) {
  return data.map((item: any) => {
    let timeStart =
      item.type == "MEETING"
        ? item.timeStart
        : calculateTimeStartTask(item.deadline);
    let timeEnd =
      item.type == "MEETING"
        ? item.timeEnd
        : calculateTimeEndTask(item.deadline);
    return {
      id: item.id,
      title: item.title,
      start: new Date(timeStart),
      end: new Date(timeEnd),
      type: item.type,
    } as unknown as ScheduleModel;
  });
}

function calculateTimeStartTask(deadline: Date) {
  const midnight = new Date(deadline).setHours(0, 0, 0, 0);
  const deadlineTime = new Date(deadline);
  const distance = (deadlineTime.getTime() - midnight) / 3600000;

  if (distance < 0) {
    return new Date(midnight).setHours(new Date(midnight).getHours() - 1);
  }
  if (0 <= distance && distance <= 1) {
    return midnight;
  }
  return new Date(deadlineTime).setHours(new Date(deadlineTime).getHours() - 1);
}

function calculateTimeEndTask(deadline: Date) {
  const midnight = new Date(deadline).setHours(0, 0, 0, 0);
  const deadlineTime = new Date(deadline);
  const distance = (deadlineTime.getTime() - midnight) / 3600000;

  if (distance < 0) {
    return midnight;
  }
  if (0 <= distance && distance <= 1) {
    return new Date(deadlineTime).setHours(0, 40, 0, 0);
  }
  return new Date(deadlineTime);
}

export default ScheduleServices;
