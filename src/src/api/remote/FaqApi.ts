import { FAQ_SAMPLE, FaqModel } from "~/models/faq";
import axiosClient from "./AxiosClient";

const FaqApi = {
  getGroupFaq: async (groupId: string) => {
    const URL = `/api/faqs?groupId=${groupId}`;
    try {
      const response: any = await axiosClient.get(URL);
      return response as FaqModel[];
    } catch (error) {
      console.log("@API_ERROR_FaqApi_getGroupFaq: ", error);
      return [FAQ_SAMPLE];
    }
  },

  getFaqDetail: async (faqId: string) => {
    try {
      const URL = `api/faqs/${faqId}`;
      const response: any = await axiosClient.get(URL);
      return response;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_getFaqDetail: ", error);
      return FAQ_SAMPLE;
    }
  },

  // HAVED
  createFaq: async (requestData: any) => {
    const URL = "/api/faqs";
    try {
      const faqId = await axiosClient.post(URL, requestData);
      console.log("@API_response_FaqApi_createFaq: ", faqId);
      return true;
      // return response;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_createFaq: ", error);
      return false;
    }
  },

  // HAVED
  updateFaq: async (taskId: string, requestData: any) => {
    const URL = `/api/faqs/${taskId}`;
    try {
      const response = await axiosClient.patch(URL, requestData);
      console.log("@API_response_FaqApi_updateFaq: ", response);
      return true;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_updateFaq: ", error);
      return false;
    }
  },
  // HAVED
  deleteFaq: async (faqId: string) => {
    try {
      const URL = `api/faqs/${faqId}`;
      await axiosClient.delete(URL);
      return true;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_deleteFaq: ", error);
      return false;
    }
  },
  upvoteFaq: async (faqId: string) => {
    try {
      const URL = `api/faqs/${faqId}/upvote`;
      await axiosClient.post(URL);
      return true;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_upvoteFaq: ", error);
      return false;
    }
  },
  downVote: async (faqId: string) => {
    try {
      const URL = `api/faqs/${faqId}/downVote`;
      await axiosClient.post(URL);
      return true;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_downVote: ", error);
      return false;
    }
  },

  importFAQs: async (toGroupId: string, payload: any) => {
    try {
      const URL = `api/faqs/${toGroupId}/import`;
      await axiosClient.post(URL, payload);
      return true;
    } catch (error) {
      console.log("@API_ERROR_FaqApi_importFAQs: ", error);
      return false;
    }
  },
};

export default FaqApi;
