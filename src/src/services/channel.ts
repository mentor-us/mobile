import ChanelApi from "~/api/remote/ChannelsApi";
import {GroupMemberModel, GroupModel,GroupChannel, GROUP_SAMPLE} from "~/models/group";
import {ShortMedia, ShortMediaList} from "~/models/media";
import Helper from "~/utils/Helper";

const ChannelService = {
    search: async (
        query: string = "",
        type: string = "",
        page: number = 0,
        pageSize: number = 25,
      ): Promise<GroupChannel[]> => {
        try {
          // Todo: check bug khi doi respone thanh respone data
          const data : GroupChannel[] = await ChanelApi.search(
            query,
            type,
            page,
            pageSize,
          );
    
          if (data && data.length > 0) {
            return data;
          }
          return [];
        } catch (error) {
          console.log("SERVIVES_ERROR_all: ", error);
          return [];
        }
      },
      forward :async (
        messageId: string = "",
        channelIds: string[] = [],
      ): Promise<any> => {
        try {
          const data = await ChanelApi.forward(
            messageId,  
            channelIds
          );
          return data;
        } catch (error) {
          console.log("SERVIVES_ERROR_all: ", error);
          return [];
        }
      },
}
export default ChannelService;