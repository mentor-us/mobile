import { useQuery } from "@tanstack/react-query";
import GradeApi from "~/api/remote/GradeApi";

export const CurrentUserQueryKey = ["grades"];

export const useGetAllGrade = params => {
  return useQuery({
    queryKey: CurrentUserQueryKey,
    queryFn: async () => GradeApi.getAllGrade(params),
    enabled: true,
  });
};
