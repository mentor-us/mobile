import { VoteDetail } from "~/models/vote";
import axiosClient from "./AxiosClient";
import { AxiosResponse } from "axios";

const VotingApi = {
  getGroupVotes: async (groupId: string) => {
    const URL = `/api/votes?groupId=${groupId}`;
    try {
      const response: any = await axiosClient.get(URL);
      if (!response) {
        return [];
      }
      return response;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_getGroupVoting: ", error);
      return [];
    }
  },
  getVotingDetail: async (votingId: string) => {
    try {
      const URL = `api/votes/${votingId}`;
      const response: any = await axiosClient.get(URL);
      return response;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_getVotingDetail: ", error);
    }
  },
  createVoting: async (requestData: any) => {
    const URL = "/api/votes";
    try {
      const response: any = await axiosClient.post(URL, requestData);
      return response;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_createVoting: ", error);
    }
  },

  //add option
  updateVoting: async (votingId: string, requestData: any) => {
    const URL = `/api/votings/${votingId}`;
    try {
      const response = await axiosClient.patch(URL, requestData);
      // return response;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_updateVoting: ", error);
    }
  },
  doVoting: async (votingId: string, requestData: any) => {
    try {
      const URL = `api/votes/${votingId}/voting`;
      const response = await axiosClient.post(URL, requestData);

      //return response;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_getVotingDetail: ", error);
    }
  },

  closeVote: async (votingId: string) => {
    try {
      if (!votingId) {
        return;
      }
      const URL = `api/votes/${votingId}/close`;
      const response = await axiosClient.patch(URL);
      // return response.data;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_closeVote: ", error);
    }
  },

  reopenVote: async (votingId: string) => {
    try {
      if (!votingId) {
        return;
      }
      const URL = `api/votes/${votingId}/reopen`;
      const response = await axiosClient.patch(URL);
      // return response.data;
    } catch (error) {
      console.log("@API_ERROR_VotingApi_reopenVote: ", error);
    }
  },
};

export default VotingApi;
