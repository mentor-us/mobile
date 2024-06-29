import { useQuery } from "@tanstack/react-query";
import GradeApi from "~/api/remote/GradeApi";
import YearApi from "~/api/remote/YearApi";

// export const CurrentUserQueryKey = ["grades", params];

export const useGetAllGrade = params => {
  return useQuery({
    queryKey: ["grades", params],
    queryFn: async () => GradeApi.getAllGrade(params),
    // enabled: !params,
  });
};
export const useGetAllYears = yearInfo =>
  useQuery({
    queryKey: ["years", yearInfo],
    queryFn: async () => {
      try {
        const res = await YearApi.getAllYears({
          yearInfo,
        });
        const yearsFormat = [...res?.data].map(year => {
          return {
            label: year.name,
            value: year.id,
            parent: null,
          };
        });
        return yearsFormat;
      } catch (error) {
        return [];
      }
    },
    enabled: true,
  });
export const getAllSemesterOfYear = semesterInfo =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useQuery({
    queryKey: ["years/semester", semesterInfo],
    queryFn: async () => {
      try {
        const res = await YearApi.getAllSemesterOfYear({
          query: semesterInfo,
        });
        const semesterFormat = [...res?.data].map(semester => {
          return {
            label: semester.name,
            value: semester.id,
            parent: null,
          };
        });
        return semesterFormat;
      } catch (error) {
        return [];
      }
    },
    enabled: true,
  });
