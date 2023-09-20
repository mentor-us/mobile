import FaqApi from "~/api/remote/FaqApi";
import {FAQ_IMPORT_LIST_SAMPLE, FaqImportList} from "~/models/faq";

const FaqService = {
  getGroupFAQs: async (groupId: string): Promise<FaqImportList> => {
    try {
      const data = await FaqApi.getGroupFaq(groupId);
      if (!data) {
        return FAQ_IMPORT_LIST_SAMPLE;
      }

      return {
        checkedAll: "unchecked",
        data: data.map(faq => {
          return {
            ...faq,
            status: "unchecked",
          };
        }),
      } as FaqImportList;
    } catch (error) {
      console.log("@SCREEN_GroupFAQ: ", error);
      return FAQ_IMPORT_LIST_SAMPLE;
    }
  },
};

export default FaqService;
