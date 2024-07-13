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
interface DropDownDataFormat {
  label: string;
  value: string;
  parent: null;
}
export const useGetAllYears = yearInfo =>
  useQuery({
    queryKey: ["years", yearInfo],
    queryFn: async () => {
      try {
        // const res = await YearApi.getAllYears({
        //   yearInfo,
        // });
        // const yearsFormat = [...res?.data].map(year => {
        //   return {
        //     label: year.name,
        //     value: year.id,
        //     parent: null,
        //   };
        // });
        // return yearsFormat;
        const params = {
          pageSize: 999,
        };
        const gradeRes = await GradeApi.getAllGrade({ ...params });
        const formatData = [...gradeRes?.data].map(grade => {
          return {
            ...grade,
            year: grade?.year?.name,
            semester: grade?.semester?.name,
            courseName: grade?.course?.name,
            courseCode: grade?.course?.code,
          };
        });
        const DropDownDataFormat: DropDownDataFormat[] = formatData.map(
          grade => {
            return {
              label: grade.year,
              value: grade.year,
              parent: null,
            };
          },
        );
        const uniqueValues = Array.from(
          new Set(DropDownDataFormat.map(item => item.value)),
        ).map(value => DropDownDataFormat.find(item => item.value === value));

        return uniqueValues;
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
        // const res = await YearApi.getAllSemesterOfYear({
        //   query: semesterInfo,
        // });
        // const semesterFormat = [...res?.data].map(semester => {
        //   return {
        //     label: semester.name,
        //     value: semester.id,
        //     parent: null,
        //   };
        // });
        // return semesterFormat;
        const params = {
          pageSize: 999,
        };
        const gradeRes = await GradeApi.getAllGrade({ ...params });
        const formatData = [...gradeRes?.data].map(grade => {
          return {
            ...grade,
            year: grade?.year?.name,
            semester: grade?.semester?.name,
            courseName: grade?.course?.name,
            courseCode: grade?.course?.code,
          };
        });
        const semesterFormat: DropDownDataFormat[] = formatData.map(grade => {
          return {
            label: grade.semester,
            value: grade.semester,
            parent: null,
          };
        });
        const uniqueValues = Array.from(
          new Set(semesterFormat.map(item => item.value)),
        ).map(value => semesterFormat.find(item => item.value === value));

        return uniqueValues;
      } catch (error) {
        return [];
      }
    },
    enabled: true,
  });
