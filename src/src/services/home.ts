import HomeApi from "~/api/remote/HomeApi";
import {GroupModel} from "~/models/group";
import {HomePageContentModel, HOME_PAGE_SAMPLE} from "~/models/home";
import {MeetingModel} from "~/models/meeting";
import {TaskModel} from "~/models/task";

const HomeServices = {
  getHomePageData: async (): Promise<HomePageContentModel> => {
    try {
      const data: any = await HomeApi.getHomePageData();

      if (data) {
        const pinnedGroups: GroupModel[] = data.pinnedGroups.map(item => {
          return {
            ...item,
            pinned: true,
          } as GroupModel;
        });

        const groups: GroupModel[] = data.groups.content
          .filter(item => {
            const existed: GroupModel | undefined = pinnedGroups.find(
              _item => _item.id === item.id,
            );
            return !Boolean(existed);
          })
          .map(item => {
            return {
              ...item,
              pinned: false,
            } as GroupModel;
          });

        const result = {
          ...data,
          groups: {
            data: [...pinnedGroups, ...groups],
            last: data.groups.last,
          },
        } as HomePageContentModel;

        return result;
      }

      return HOME_PAGE_SAMPLE;
    } catch (error) {
      return HOME_PAGE_SAMPLE;
    }
  },

  getPinnedGroups: async (): Promise<GroupModel[]> => {
    try {
      const data: any = await HomeApi.getHomePageData();

      if (data) {
        const pinnedGroups: GroupModel[] = data.pinnedGroups.map(item => {
          return {
            ...item,
            pinned: true,
          } as GroupModel;
        });
        return pinnedGroups;
      }

      return [];
    } catch (error) {
      console.log("@ERROR_SERVICES_getPinnedGroups: ", error);
      return [];
    }
  },

  getIncommingEvents: async () => {
    try {
      const data: any = await HomeApi.getHomePageData();

      if (data.events && data.events.length >= 0) {
        return data.events;
      }

      return [];
    } catch (error) {
      console.log("@ERROR_SERVICES_getIncommingEvents: ", error);
      return [];
    }
  },
};

export default HomeServices;
