/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  getAllSemesterOfYear,
  useGetAllGrade,
  useGetAllYears,
} from "~/app/server/grades/queries";
import GradeItem from "./GradeItem";
import { Colors, Text } from "react-native-paper";
import FontSize from "~/constants/FontSize";
import { useQueryClient } from "@tanstack/react-query";
import { Dropdown } from "react-native-element-dropdown";
import { Color } from "~/constants/Color";
import { UserProfileModel } from "~/models/user";
interface GradeBoardProps {
  user: UserProfileModel;
}

export default function GradeBoard({ user }: GradeBoardProps) {
  const { data: years } = useGetAllYears("");
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const queryClient = useQueryClient();
  const [isYearFocus, setIsYearFocus] = useState(false);
  const [isSemesterFocus, setIsSemesterFocus] = useState(false);
  const { data: semesters } = getAllSemesterOfYear("");

  const { data: grades, isFetching: isLoadingGrade } = useGetAllGrade({
    userId: user?.id ?? null,
    year: year,
    semester: semester,
    pageSize: 25,
    page: 0,
  });

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["grades"],
    });
  }, [year, semester]);

  return (
    <View>
      <View style={{ marginLeft: 7, paddingVertical: 8 }}>
        <Text style={{ fontSize: FontSize.large }}>Năm học:</Text>
      </View>
      <View style={[styles.container, { marginLeft: 7 }]}>
        <Dropdown
          data={years ?? []}
          maxHeight={300}
          labelField="label"
          valueField="value"
          onChange={item => {
            setYear(item.value);
            setIsYearFocus(false);
          }}
          placeholder={!isYearFocus ? "Chọn năm học" : "..."}
          value={year}
          onFocus={() => setIsYearFocus(true)}
          onBlur={() => setIsYearFocus(false)}
          style={[
            styles.dropdown,
            isYearFocus && { borderColor: Color.primary },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          activeColor={Colors.grey300}
        />
      </View>

      <View style={{ marginLeft: 7, paddingVertical: 8 }}>
        <Text style={{ fontSize: FontSize.large }}>Học kì:</Text>
      </View>
      <View style={[styles.container, { marginLeft: 7 }]}>
        <Dropdown
          style={[
            styles.dropdown,
            isSemesterFocus && { borderColor: Color.primary },
          ]}
          data={semesters ?? []}
          maxHeight={300}
          labelField="label"
          valueField="value"
          onChange={item => {
            setSemester(item.value);
            setIsSemesterFocus(false);
          }}
          placeholder={!isSemesterFocus ? "Chọn học kì" : "..."}
          value={semester}
          onFocus={() => setIsSemesterFocus(true)}
          onBlur={() => setIsSemesterFocus(false)}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
        />
      </View>

      <View style={{ padding: 7 }}>
        {grades && !isLoadingGrade && !grades?.totalCounts && (
          <Text
            style={{
              alignSelf: "center",
              padding: 5,
              fontSize: FontSize.large,
            }}>
            Không có thông tin điểm số
          </Text>
        )}
        {grades?.data &&
          [...grades?.data].map(grade => {
            return <GradeItem key={`grade-${grade.id}`} grade={grade} />;
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  dropdown: {
    height: 50,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
