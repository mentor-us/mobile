import GroupApi from "~/api/remote/GroupApi";
import { RoleType } from "~/models/commonTypes";
import { GroupMemberModel, GroupModel, GROUP_SAMPLE } from "~/models/group";
import { ShortMedia, ShortMediaList } from "~/models/media";
import Helper from "~/utils/Helper";

const GroupService = {
  all: async (type = "", page = 0, pageSize = 25): Promise<GroupModel[]> => {
    try {
      const data: GroupModel[] | undefined = await GroupApi.all(
        type,
        page,
        pageSize,
      );

      if (data && data.length > 0) {
        return data.sort((a, b) => {
          const k1 = a.pinned ? 1 : 0;
          const k2 = b.pinned ? 1 : 0;
          return k2 - k1;
        });
      }
      return [];
    } catch (error) {
      console.log("SERVIVES_ERROR_all: ", error);
      return [];
    }
  },

  findById: async (id: string): Promise<GroupModel> => {
    try {
      const data: GroupModel | undefined = await GroupApi.findById(id);
      if (data) {
        return data;
      }
      return GROUP_SAMPLE;
    } catch (error) {
      console.log("SERVICES_GROUP_ERROR_findById: ", error);
      return GROUP_SAMPLE;
    }
  },

  getMembers: async (groupId: string): Promise<GroupMemberModel[]> => {
    if (!groupId) {
      console.log("SERVICES_GROUP_ERROR_getMembers: empty groupId input");
      return [];
    }
    try {
      const data: any = await GroupApi.getMembers(groupId);
      // re-format mentors
      const mentors = data.mentors
        ? data.mentors.map(item => {
            return {
              ...item,
              role: RoleType.MENTOR,
            } as GroupMemberModel;
          })
        : [];

      // re-format mentees
      const mentees = data.mentees
        ? data.mentees
            .map(item => {
              return {
                ...item,
                role: RoleType.MENTEE,
              } as GroupMemberModel;
            })
            .sort((a, b) => {
              if (b.role === RoleType.MENTOR || a.role === RoleType.MENTOR) {
                return 0;
              }
              const k1 = a.marked ? 1 : 0;
              const k2 = b.marked ? 1 : 0;
              return k2 - k1;
            })
        : [];

      const result = [...mentors, ...mentees];
      return result;
    } catch (error) {
      console.log("SERVICES_GROUP_ERROR_getMembers: ", error);
      return [];
    }
  },

  getGroupMedia: async (groupId: string): Promise<ShortMediaList | null> => {
    try {
      const data: any = await GroupApi.getGroupMedia(groupId);
      if (!data) {
        return null;
      }
      const formatedData = data.map(media => {
        return {
          ...media,
          time: {
            time: Helper.formatDate(data.deadline, "time"),
            date: Helper.formatDate(data.deadline, "date"),
            displayName: Helper.getTime(data.deadline),
          },
        } as ShortMedia;
      });
      const images: ShortMedia[] = formatedData.filter(
        media => media.type == "IMAGE",
      );
      const files: ShortMedia[] = formatedData.filter(
        media => media.type == "FILE",
      );
      return {
        images: images,
        files: files,
      } as ShortMediaList;
    } catch (error) {
      console.log("SERVICES_GROUP_ERROR_getGroupMedia: ", error);
      return null;
    }
  },
};

export default GroupService;
