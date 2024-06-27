/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LayoutDimensions } from "~/constants/GlobalStyles";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import { UserNameIcon } from "~/assets/svgs";
interface Props {
  grade: any;
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  button: {
    maxWidth: LayoutDimensions.XLarge,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",

    // marginVertical: 8,
    marginBottom: LayoutDimensions.Medium,
  },
  containerInfo: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  // eslint-disable-next-line react-native/no-unused-styles
  field: {
    flexShrink: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  fieldName: {
    color: Color.text[2],
    fontSize: FontSize.normal,
    fontWeight: "bold",
  },
  icon: {
    backgroundColor: Color.gray[1],
    borderRadius: 30,
    padding: LayoutDimensions.Small,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  nullText: {
    color: "#7575757d",
    fontSize: FontSize.larger,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  text: {
    color: Color.text[1],
    fontSize: FontSize.larger,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  textAction: {
    color: Color.green,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  textActionDelete: {
    color: Color.red,
  },
});

export default function GradeItem({ grade }: Props) {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 8,
        maxWidth: "100%",
      }}>
      <View>
        <View style={styles.icon}>
          <UserNameIcon
            width={LayoutDimensions.Large}
            height={LayoutDimensions.Large}
          />
        </View>
      </View>
      <View
        style={{
          flexGrow: 1,
          paddingLeft: 2,
          paddingRight: 2,
          maxWidth: `80%`,
        }}>
        <Text style={styles.text} ellipsizeMode="tail" numberOfLines={2}>
          {grade?.course?.name ?? "11"}
        </Text>
      </View>
      <View>
        <Text style={styles.text}>{grade?.score ?? ""}</Text>
      </View>
    </View>
  );
}
