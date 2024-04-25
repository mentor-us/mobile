import TaskApi from "~/api/remote/TaskApi";
import { SchedulesList } from "~/models/commonTypes";
import { Assignee, TaskModel, TASK_SAMPLE } from "~/models/task";
import Helper from "~/utils/Helper";

const formatData = (data: any): TaskModel[] => {
  return data.map((item: TaskModel) => {
    return {
      ...item,
      deadlineTimeModel: {
        time: Helper.formatDate(item.deadline, "time"),
        date: Helper.formatDate(item.deadline, "date"),
        displayName: Helper.getTime(item.deadline),
      },
      status: item.status || "NULL",
    } as TaskModel;
  });
};

const toUpcomingOrPassedTasks = (formatData: TaskModel[]): SchedulesList => {
  formatData.sort((a, b) => {
    const left = new Date(a.deadline);
    const right = new Date(b.deadline);
    return right.getTime() - left.getTime();
  });

  const current = new Date();

  const result: SchedulesList = {
    upcoming: formatData.filter(item => {
      const date = new Date(item.deadline);
      return date.getTime() >= current.getTime();
    }),
    passed: formatData.filter(item => {
      const date = new Date(item.deadline);
      return date.getTime() < current.getTime();
    }),
  };
  return result;
};

const TaskServices = {
  getGroupTask: async (groupId: string): Promise<SchedulesList> => {
    try {
      const data: any = await TaskApi.getGroupTask(groupId);

      if (data && data.length) {
        const formattedData: TaskModel[] = formatData(data);
        return toUpcomingOrPassedTasks(formattedData);
      }

      return {
        upcoming: [],
        passed: [],
      };
    } catch (error) {
      console.log("@SERVICE_getGroupTask: ", error);

      return {
        upcoming: [],
        passed: [],
      };
    }
  },

  getOwnGroupTask: async (groupId: string): Promise<SchedulesList> => {
    try {
      const data: any = await TaskApi.getOwnGroupTask(groupId);

      if (data && data.length) {
        const formattedData: TaskModel[] = formatData(data);
        return toUpcomingOrPassedTasks(formattedData);
      }

      return {
        upcoming: [],
        passed: [],
      };
    } catch (error) {
      console.log("@SERVICE_getOwnGroupTask: ", error);

      return {
        upcoming: [],
        passed: [],
      };
    }
  },

  getOwnAssignedTask: async (groupId: string): Promise<SchedulesList> => {
    try {
      const data: any = await TaskApi.getOwnAssignedTask(groupId);

      if (data && data.length) {
        const formattedData: TaskModel[] = formatData(data);
        return toUpcomingOrPassedTasks(formattedData);
      }

      return {
        upcoming: [],
        passed: [],
      };
    } catch (error) {
      console.log("@SERVICE_getOwnAssignedTask: ", error);

      return {
        upcoming: [],
        passed: [],
      };
    }
  },

  getOwnAssignedByMeTask: async (groupId: string): Promise<SchedulesList> => {
    try {
      const data: any = await TaskApi.getOwnAssignedByMeTask(groupId);

      if (data && data.length) {
        const formattedData: TaskModel[] = formatData(data);
        return toUpcomingOrPassedTasks(formattedData);
      }

      return {
        upcoming: [],
        passed: [],
      };
    } catch (error) {
      console.log("@SERVICE_getOwnAssignedByMeTask: ", error);

      return {
        upcoming: [],
        passed: [],
      };
    }
  },

  getTaskDetail: async (taskId: string): Promise<TaskModel> => {
    try {
      const data: TaskModel | undefined = await TaskApi.getTaskDetail(taskId);

      if (!data) {
        return TASK_SAMPLE;
      }

      return {
        ...data,
        deadlineTimeModel: {
          time: Helper.formatDate(data.deadline, "time"),
          date: Helper.formatDate(data.deadline, "date"),
          displayName: Helper.getTime(data.deadline),
        },
        status: data.status || "NULL",
        group: data.group || "",
        assigner: data.assigner || "",
      } as TaskModel;
    } catch (error) {
      console.log("@SERVICES_ERROR_TaskApi_getTaskDetail: ", error);
      return TASK_SAMPLE;
    }
  },

  getTaskAssinees: async (taskId: string): Promise<Assignee[]> => {
    try {
      const data: any = await TaskApi.getTaskAssignees(taskId);

      if (data) {
        const formatData: Assignee[] = data.map(item => {
          return {
            ...item,
            role: item.mentor == false ? "MENTEE" : "MENTOR",
          } as Assignee;
        });

        return formatData;
      }

      return [];
    } catch (error) {
      return [];
    }
  },

  fulfillTaskStatus: (task: any, currentUserId: string): TaskModel => {
    const ownAssignee = task.assignees.find(
      assignee => assignee.id == currentUserId,
    );
    return {
      ...task,
      deadlineTimeModel: {
        time: Helper.formatDate(task?.deadline || "", "time"),
        date: Helper.formatDate(task?.deadline || "", "date"),
        displayName: Helper.getTime(task?.deadline || ""),
      },
      status: !ownAssignee ? "NULL" : ownAssignee.status,
    } as TaskModel;
  },
};

export default TaskServices;
