import { useQuery } from "@tanstack/react-query";
import { GetTaskDetailKey } from "./key";
import TaskServices from "~/services/task";

export const useGetTaskDetailQuery = (taskId: string) => {
  return useQuery({
    queryKey: GetTaskDetailKey(taskId),
    queryFn: async () => {
      return await TaskServices.getTaskDetail(taskId);
    },
    enabled: !!taskId,
  });
};
