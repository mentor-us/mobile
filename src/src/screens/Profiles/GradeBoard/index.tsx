/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { View } from "react-native";
import {
  getAllSemesterOfYear,
  useGetAllGrade,
  useGetAllYears,
} from "~/app/server/grades/queries";
import GradeItem from "./GradeItem";
import DropDownPicker from "react-native-dropdown-picker";
import { Text } from "react-native-paper";
import FontSize from "~/constants/FontSize";
import { useQueryClient } from "@tanstack/react-query";
interface Props {
  user: any;
}

export default function GradeBoard({ user }: Props) {
  const { data: years } = useGetAllYears("");
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const queryClient = useQueryClient();

  const { data: semesters } = getAllSemesterOfYear("");
  const { data: grades } = useGetAllGrade({
    userId: user?.id ?? null,
    yearId: year,
    semesterId: semester,
    pageSize: 25,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [openSemester, setOpenSemester] = useState(false);
  useMemo(() => {
    queryClient.refetchQueries({
      queryKey: ["grades"],
    });
  }, [year, semester]);
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
          zIndex: open ? 1000 : 100,
          paddingLeft: 7,
        }}>
        <DropDownPicker
          placeholder="Chọn năm học"
          open={open}
          value={year}
          items={years ?? []}
          setOpen={setOpen}
          setValue={setYear}
          theme="LIGHT"
          multiple={false}
          mode="SIMPLE"
        />
      </View>
      <View style={{ marginLeft: 7, paddingVertical: 8 }}>
        <Text style={{ fontSize: FontSize.large }}>Học kì:</Text>
      </View>
      <View
        style={{
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          zIndex: openSemester ? 1000 : 100,
          paddingLeft: 7,
        }}>
        <DropDownPicker
          placeholder="Chọn học kì"
          open={openSemester}
          value={semester}
          items={semesters ?? []}
          setOpen={setOpenSemester}
          setValue={setSemester}
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
