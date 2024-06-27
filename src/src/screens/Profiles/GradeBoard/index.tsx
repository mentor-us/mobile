import React, { useReducer } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useGetAllGrade } from "~/app/server/grades/queries";
import GradeItem from "./GradeItem";
interface Props {
  user: any;
}

const initState = {
  year: null,
  yearInfo: "",
  semester: null,
  semesterInfo: ""
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_YEAR_INFO":
      return { ...state, yearInfo: action.payload };
    case "SET_SEMESTER":
      return { ...state, semester: action.payload };
    case "SET_SEMESTER_INFO":
      return { ...state, semesterInfo: action.payload };
    default:
      return state;
  }
}

export default function GradeBoard({ user }: Props) {
  console.log(user);
  const [state, dispatch] = useReducer(reducer, initState);
  const { year, yearInfo, semester, semesterInfo } = state;
  const { data: grades, isFetching: isLoadingGrade } = useGetAllGrade({
    userId: user?.id ?? null,
    yearId: year?.id ?? null,
    semesterId: semester?.id ?? null,
    pageSize: 25,
    page: 0,
  });
  return (
    <View>
      {grades?.data &&
        [...grades?.data].map(grade => {
          return <GradeItem key={`grade-${grade.id}`} grade={grade} />;
        })}
    </View>
  );
}
