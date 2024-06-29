/* eslint-disable react-native/no-inline-styles */
import React, { useReducer, useState } from "react";
import { View } from "react-native";
import { useGetAllGrade } from "~/app/server/grades/queries";
import GradeItem from "./GradeItem";
import DropDownPicker from "react-native-dropdown-picker";
import { Text } from "react-native-paper";
import FontSize from "~/constants/FontSize";
interface Props {
  user: any;
}

const initState = {
  year: null,
  yearInfo: "",
  semester: null,
  semesterInfo: "",
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Spain", value: "spain" },
    { label: "Madrid", value: "madrid", parent: "spain" },
    { label: "Barcelona", value: "barcelona", parent: "spain" },
    { label: "Italy", value: "italy" },
    { label: "Rome", value: "rome", parent: "italy" },
    { label: "Finland", value: "finland" },
  ]);

  return (
    <View>
      <View style={{ marginLeft: 7, paddingVertical: 8 }}>
        <Text style={{ fontSize: FontSize.large }}>Năm học:</Text>
      </View>
      <View
        style={{
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          paddingLeft: 7,
        }}>
        <DropDownPicker
          placeholder="Chọn năm học"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          theme="LIGHT"
          multiple={false}
          mode="SIMPLE"
        />
      </View>
      <View style={{ padding: 7 }}>
        {grades?.data &&
          [...grades?.data].map(grade => {
            return <GradeItem key={`grade-${grade.id}`} grade={grade} />;
          })}
      </View>
    </View>
  );
}
