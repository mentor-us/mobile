import axiosClient from "./AxiosClient";

const MeetingApi = {
  getGroupMeeting: async (groupId: string) => {
    const URL = `/api/meetings?groupId=${groupId}`;
    try {
      const response = await axiosClient.get(URL);
      return response;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_getGroupMeeting: ", error);
    }
  },
  getMeetingDetail: async (meetingId: string) => {
    try {
      const URL = `api/meetings/${meetingId}`;
      const response = await axiosClient.get(URL);

      return response.data;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_getMeetingDetail: ", error);
    }
  },
  createMeeting: async (requestData: any) => {
    const URL = "/api/meetings";
    try {
      const response = await axiosClient.post(URL, requestData);
      console.log(response);
      // return response;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_createMeeting: ", error);
    }
  },
  updateMeeting: async (meetingId: string, requestData: any) => {
    const URL = `/api/meetings/${meetingId}`;
    try {
      const response = await axiosClient.patch(URL, requestData);
      // return response;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_updateMeeting: ", error);
    }
  },
  getMeetingAttendees: async (meetingId: string) => {
    try {
      const URL = `api/meetings/${meetingId}/attendees`;
      const response = await axiosClient.get(URL);

      return response.data;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_getMeetingDetail: ", error);
    }
  },

  deleteMeeting: async (meetingId: string) => {
    try {
      const URL = `api/meetings/${meetingId}`;
      const response = await axiosClient.delete(URL);
      // return response.data;
    } catch (error) {
      console.log("@API_ERROR_MeetingApi_deleteMeeting: ", error);
    }
  },
};

export default MeetingApi;
