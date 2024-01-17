import {AxiosError, AxiosResponse} from "axios";
import {GroupModel, GROUP_SAMPLE, GroupChannelSearchInput} from "~/models/group";
import axiosClient from "./AxiosClient";

const channelPath = "/api/groups";
const ChanelApi = {
    search: async (query: string = "",type: string = "", page: number = 0, pageSize: number = 25)  => {
        // const URL = `/api/groups/own`;
        const URL = `${channelPath}/own`;
        try {
          const response: AxiosResponse = await axiosClient.get<GroupModel[]>(URL,{
            params:{
                query,
                type,
                page,
                pageSize
            }
          });
          return response.data.groups;
        } catch (err) {
          const error = err as AxiosError;
          console.log(error);
          return [];
        }
    },
}

export default ChanelApi;