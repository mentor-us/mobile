import { AxiosError, AxiosResponse } from "axios";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import axiosClient from "./AxiosClient";

const GroupApi = {
  all: async (type: string = "", page: number = 0, pageSize: number = 25) => {
    const URL = `/api/groups/own?page=${page}&pageSize=${pageSize}&type=${type}`;
    try {
      const response: AxiosResponse = await axiosClient.get<GroupModel[]>(URL);
      return response.data.groups;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      return [];
    }
  },

  recent: async (page: number = 1, pageSize: number = 10) => {
    const URL = `/api/groups/recent?page=${page}&pageSize=${pageSize}`;
    let groups: GroupModel[] = [];
    try {
      const response: AxiosResponse = await axiosClient.get<GroupModel[]>(URL);
      groups = response.data.groups;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }
    return groups;
  },

  findById: async (id: string) => {
    try {
      const URL = `/api/groups/${id}/detail`;
      const response: AxiosResponse = await axiosClient.get<GroupModel>(URL);
      return response.data;
    } catch (error) {
      return GROUP_SAMPLE;
    }
  },

  getMembers: async (groupId: string) => {
    const URL = `/api/groups/${groupId}/members`;
    try {
      const response = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR: ", error);
    }
  },

  markMentee: async (menteeId: string, groupId: string) => {
    const URL = `/api/groups/${groupId}/star?menteeId=${menteeId}`;
    try {
      const response = await axiosClient.post(URL);
      return true;
    } catch (error) {
      console.log("@API_GORUP markMember _ERROR: ", error);
      return false;
    }
  },

  unmarkMentee: async (menteeId: string, groupId: string) => {
    const URL = `/api/groups/${groupId}/star?menteeId=${menteeId}`;
    try {
      const response = await axiosClient.delete(URL);
      return true;
    } catch (error) {
      console.log("@API_GORUP markMember _ERROR: ", error);
      return false;
    }
  },

  pinGroup: async (groupId: string) => {
    const URL = `/api/groups/${groupId}/pin`;
    try {
      const response = await axiosClient.post(URL);
    } catch (error) {
      console.log("@API_pinGroup_ERROR: ", error);
    }
  },

  unpinGroup: async (groupId: string) => {
    const URL = `/api/groups/${groupId}/unpin`;
    try {
      const response = await axiosClient.post(URL);
    } catch (error) {
      console.log("@API_pinGroup_ERROR: ", error);
    }
  },

  getGroupMedia: async (groupId: string) => {
    const URL = `/api/groups/${groupId}/media`;
    try {
      const response = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_getGroupMedia_ERROR: ", error);
    }
  },

  pinMessage: async (groupId: string, messageId: string) => {
    const URL = `/api/groups/${groupId}/pin-message?messageId=${messageId}`;
    try {
      const data = await axiosClient.post(URL);
    } catch (error) {
      console.log("@API_MESSAGE pinMessage ERROR: ", error);
    }
  },

  unpinMessage: async (groupId: string, messageId: string) => {
    const URL = `/api/groups/${groupId}/unpin-message?messageId=${messageId}`;
    try {
      const data = await axiosClient.post(URL);
    } catch (error) {
      console.log("@API_MESSAGE unpinMessage ERROR: ", error);
    }
  },

  getWorkspace: async (groupId: string) => {
    const URL = `/api/groups/${groupId}/workspace`;
    try {
      const data: any = await axiosClient.get(URL);
      return data;
    } catch (error) {
      console.log("@API_GROUP_ERROR: Get workspace", error);
    }
  },

  getChannels: async (groupId: string) => {
    const URL: string = `/api/channels?parentId=${groupId}`;
    try {
      const data: any = await axiosClient.get(URL);
      return data;
    } catch (error) {
      console.log("@API_GROUP_ERROR: Get channels", error);
    }
  },

  addChannel: async (data: any) => {
    const URL = `/api/channels`;
    try {
      const newChannel: any = await axiosClient.post(URL, data);
      return newChannel;
    } catch (error) {
      console.log("@API_GROUP_ERRO: Add new channel", error);
      return false;
    }
  },

  updateChannel: async (channelId: string, data: any) => {
    const URL = `/api/channels/${channelId}`;
    try {
      await axiosClient.patch(URL, data);
      return true;
    } catch (error) {
      console.log("@API_GROUP_ERRO: Update channel", error);
      return false;
    }
  },

  removeChannel: async (channelId: string) => {
    const URL = `/api/channels/${channelId}`;
    try {
      await axiosClient.delete(URL);
      return true;
    } catch (error) {
      console.log("@API_GROUP_ERRO: Add new channel", error);
      return false;
    }
  },

  getChannelMembers: async (channelId: string) => {
    const URL = `/api/channels/${channelId}/members`;
    try {
      const data: any = axiosClient.get(URL);
      if (!data) {
        return [];
      }
      return data;
    } catch (error) {
      console.log("@API_GROUP_ERRO: Add new channel", error);
      return [];
    }
  },
};

export default GroupApi;
