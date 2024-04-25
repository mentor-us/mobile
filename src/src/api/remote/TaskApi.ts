import axiosClient from "./AxiosClient";

const TaskApi = {
  // HAVED
  getGroupTask: async (groupId: string) => {
    const URL = `/api/channels/${groupId}/tasks`;
    try {
      const response = await axiosClient.get(URL);
      return response;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getGroupTask: ", error);
    }
  },

  getOwnGroupTask: async (groupId: string) => {
    const URL = `/api/tasks/own?groupId=${groupId}`;
    try {
      const response = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getMyGroupTask: ", error);
    }
  },

  getOwnAssignedTask: async (groupId: string) => {
    const URL = `/api/tasks/assigned?groupId=${groupId}`;
    try {
      const response = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getMyGroupTask: ", error);
    }
  },

  getOwnAssignedByMeTask: async (groupId: string) => {
    const URL = `/api/tasks/assigning?groupId=${groupId}`;
    try {
      const response = await axiosClient.get(URL);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getMyGroupTask: ", error);
    }
  },

  // HAVED
  getTaskDetail: async (taskId: string) => {
    try {
      const URL = `api/tasks/${taskId}`;
      const response = await axiosClient.get(URL);

      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getTaskDetail: ", error);
    }
  },

  // HAVED
  createTask: async (requestData: any) => {
    const URL = "/api/tasks";
    try {
      const response = await axiosClient.post(URL, requestData);
      console.log("@API_response_TaskApi_createTask: ", response);

      // return response;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_createTask: ", error);
    }
  },

  // HAVED
  updateTask: async (taskId: string, requestData: any) => {
    const URL = `/api/tasks/${taskId}`;
    try {
      const response = await axiosClient.patch(URL, requestData);
      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_updateTask: ", error);
    }
  },

  getTaskAssignees: async (taskId: string) => {
    try {
      const URL = `api/tasks/${taskId}/assignees`;
      const response = await axiosClient.get(URL);

      return response.data;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_getTaskDetail: ", error);
    }
  },
  // HAVED
  deleteTask: async (taskId: string) => {
    try {
      const URL = `api/tasks/${taskId}`;
      await axiosClient.delete(URL);
      return true;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_deleteTask: ", error);
      return false;
    }
  },

  updateStatusTask: async (taskId: string, status: string) => {
    const URL = `api/tasks/${taskId}/${status}`;
    try {
      await axiosClient.patch(URL);
      return true;
    } catch (error) {
      console.log("@API_ERROR_TaskApi_updateStatusTask: ", error);
      return false;
    }
  },
};

export default TaskApi;
