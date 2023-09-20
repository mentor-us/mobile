import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {GroupModel} from "~/models/group";
import {ScheduleModel} from "~/models/schedule";
import GroupService from "~/services/group";

const PAGE_SIZE = 25;

export function useQueryGroupList() {
  const data = useInfiniteQuery({
    queryKey: ["groups"],
    queryFn: async ({pageParam}): Promise<GroupModel[]> => {
      try {
        const groups: GroupModel[] = await GroupService.all(
          "",
          pageParam,
          PAGE_SIZE,
        );
        return groups;
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

export function useQueryIncommingEvents() {
  const data = useQuery(
    ["incomming_events"],
    async (): Promise<ScheduleModel[]> => {
      try {
        return [];
      } catch (error) {
        console.log("@DUKE - useQueryIncommingEvents: ", error);
        return [];
      }
    },
  );
}

export function useUpdateQueryGroupList() {
  const queryClient = useQueryClient();

  return {
    updateGroupPinned: (groupId: string, pinned: boolean) => {
      if (!groupId) {
        return;
      }

      queryClient.setQueryData<InfiniteData<GroupModel[]>>(["groups"], prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          pages: prev.pages.map(paginated => {
            return paginated
              .map(item => {
                if (item.id === groupId) {
                  return {...item, pinned: pinned};
                }
                return {...item};
              })
              .sort((a, b) => {
                const k1 = a.pinned ? 1 : 0;
                const k2 = b.pinned ? 1 : 0;
                return k2 - k1;
              });
          }),
        };
      });
    },

    updateGroupAvatar: (groupId: string, imageUrl: string) => {
      if (!groupId) {
        return;
      }

      queryClient.setQueryData<InfiniteData<GroupModel[]>>(["groups"], prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          pages: prev.pages.map(paginated => {
            return paginated.map(item => {
              if (item.id === groupId) {
                return {...item, imageUrl: imageUrl};
              }
              return {...item};
            });
          }),
        };
      });
    },

    updateGroupNewMessage: (groupId: string, message: string, isNew: boolean = true) => {
      if (!groupId) {
        return;
      }

      queryClient.setQueryData<InfiniteData<GroupModel[]>>(["groups"], prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          pages: prev.pages.map(paginated => {
            return paginated.map(item => {
              if (item.id === groupId) {
                return {...item, hasNewMessage: isNew, newMessage: message};
              }
              return {...item};
            });
          }),
        };
      });
    },

    seenNewMessage: (groupId: string) => {
      if (!groupId) {
        return;
      }
      queryClient.setQueryData<InfiniteData<GroupModel[]>>(["groups"], prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          pages: prev.pages.map(paginated => {
            return paginated.map(item => {
              if (item.id === groupId) {
                return {...item, hasNewMessage: false};
              }
              return {...item};
            });
          }),
        };
      });
    },
  };
}
