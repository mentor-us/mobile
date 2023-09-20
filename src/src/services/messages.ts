import MessageApi from "~/api/remote/MessagesApi";
import {MessageModel} from "~/models/message";
import {TaskStatusType} from "~/models/task";

const MessageServices = {
  getMessages: async (
    userId: string,
    groupId: string,
    page: number = 0,
    size: number = 25,
  ): Promise<MessageModel[]> => {
    try {
      const data: any = await MessageApi.getMessages(groupId, page, size);
      if (data && data.length) {
        return data.map(message => {
          if (message.type != "TASK") {
            return message;
          }

          const task = message.task;
          if (!task) {
            return message;
          }

          const subscription = task.assignees.find(
            assignee => assignee.id == userId,
          );
          let ownStatus: TaskStatusType = "NULL";
          if (subscription) {
            ownStatus = subscription.status;
          }

          return {
            ...message,
            task: {
              ...task,
              status: ownStatus,
            },
          } as MessageModel;
        });
      }
      return [];
    } catch (error) {
      console.log("@SERVICES_MessageServices_getMessages: ", error);
      return [];
    }
  },
};

export default MessageServices;
