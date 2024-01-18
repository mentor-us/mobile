import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GroupChannel, GroupModel } from "~/models/group";
import ChannelService from "~/services/channel";

const PAGE_SIZE = 25;

export function useQueryChannelList(query="") {
  const data = useInfiniteQuery({
    queryKey: ["channels",query],
    queryFn: async ({pageParam}): Promise<GroupChannel[]> => {
      try {
        const channel: GroupChannel[] = await ChannelService.search(
          query,
          "",
          pageParam,
          PAGE_SIZE,
        );
        return channel;
      } catch (error) {
        console.log("@DUKE - useQueryGroupList: ", error);
        return [];
      }
    },
    getNextPageParam: (lastPage, allPage) => {
      return lastPage.length == PAGE_SIZE ? allPage.length : undefined;
    },
    enabled: true,
  });

  return data;
}