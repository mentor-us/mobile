/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LayoutDimensions } from "~/constants/GlobalStyles";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import { EducationCap } from "~/assets/svgs";
interface Props {
  grade: any;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
    maxWidth: "100%",
  },
  courseView: {
    flexGrow: 1,
    maxWidth: `80%`,
    paddingLeft: 15,
    paddingRight: 2,
  },
  icon: {
    backgroundColor: Color.gray[1],
    borderRadius: 30,
    padding: LayoutDimensions.Small,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  text: {
    color: Color.text[1],
    fontSize: FontSize.larger,
  },
});

export default function GradeItem({ grade }: Props) {
  const isDangerous = grade?.score < 5 ?? false;
  const textColor = isDangerous ? "red" : "black";
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={styles.container}>
      <View>
        <View style={styles.icon}>
          <EducationCap
            width={LayoutDimensions.Large}
            height={LayoutDimensions.Large}
          />
        </View>
      </View>
      <View style={styles.courseView}>
        <Text
          style={[styles.text, { color: textColor }]}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {grade?.course?.name ?? "11"}
        </Text>
      </View>
      <View style={{ marginLeft: "auto" }}>
        <Text style={[styles.text, { color: textColor }]}>
          {grade?.score ?? ""}
        </Text>
      </View>
    </View>
  );
}
