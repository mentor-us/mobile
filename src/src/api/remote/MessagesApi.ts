import axiosClient from "./AxiosClient";

const MessageApi = {
  getMessages: async (groupId: string, page: number = 0, size: number = 25) => {
    const URL = `api/messages?groupId=${groupId}&page=${page}&size=${size}`;
    try {
      const response = await axiosClient.get(URL);
      return response;
    } catch (error) {
      console.log("@API_MESSAGE_ERROR: ", error);
      return [];
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const URL = `api/messages/${messageId}`;
      const data = await axiosClient.delete(URL);
    } catch (error) {
      console.log("@API_DELETE_MESSAGE_ERROR: ", error);
    }
  },

  updateMessage: async (messageId: string, newContent: string) => {
    try {
      const URL = `api/messages/edit`;
      const data = await axiosClient.post(URL, {
        messageId,
        newContent,
      });
    } catch (error) {
      console.log("@API_UPDATE_MESSAGE_ERROR: ", error);
    }
  },

  postReaction: async (
    messageId: string,
    senderId: string,
    emojiId: string,
  ) => {
    const URL = `api/messages/react`;
    try {
      const response = await axiosClient.post(URL, {
        messageId,
        senderId,
        emojiId,
      });

      console.log("@API_MESSAGE_postReaction_RESPONSE: ", response);

      return response;
    } catch (error) {
      console.log("@API_MESSAGE_postReaction_ERROR: ", error);
      return [];
    }
  },

  removeReaction: async (messageId: string, senderId: string) => {
    const URL = `api/messages/react?messageId=${messageId}&senderId=${senderId}`;
    try {
      const response = await axiosClient.delete(URL);
      return response;
    } catch (error) {
      console.log("@API_MESSAGE_removeReaction_ERROR: ", error);
      return [];
    }
  },
  mentionUsers: async (messageId: string, receiverIds: string[]) => {
    const URL = `api/messages/mention`;
    const response = await axiosClient.post(URL, {
      messageId,
      receiverIds,
    });
    return response;
  },
};

export default MessageApi;
