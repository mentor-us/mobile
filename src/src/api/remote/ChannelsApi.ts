import {AxiosError, AxiosResponse} from "axios";
import {GroupModel, GROUP_SAMPLE, GroupChannelSearchInput, GroupChannel} from "~/models/group";
import axiosClient from "./AxiosClient";

const channelPath = "/api/groups";
const ChanelApi = {
    search: async (query: string = "",type: string = "", page: number = 0, pageSize: number = 25)  => {
        // const URL = `/api/groups/own`;
        const URL = `/api/groups/forward`;
        try {
          const response: GroupChannel[] = await axiosClient.get(URL,{
            params:{
                name: query,
                type,
                page,
                pageSize
            }
          });
          console.log(response)
          console.log(response)
          return response || [];
        } catch (err) {
          const error = err as AxiosError;
          console.log(error);
          return [];
        }
    },
    forward: async (messageId: string, channelIds : string[])  => {
      // const URL = `/api/groups/own`;
      const URL = `/api/messages/forward`;
      try {
        const response: AxiosResponse = await axiosClient.post(URL,{
              messageId,
              channelIds
        });
      //   return []
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        console.log(error);
        return [];
      }
  },
}

export default ChanelApi;