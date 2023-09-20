import {View, Text, TouchableOpacity} from "react-native";
import React, {memo, useMemo} from "react";
import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {
  ClockGrayIcon,
  GroupIcon,
  LoopIcon,
  MarkerIcon,
  ParagraphIcon,
  UserNameIcon,
} from "~/assets/svgs";

import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import {Color} from "~/constants/Color";
import isEqual from "react-fast-compare";
import {InfoItemModel} from "./index.props";
import {useNavigation} from "@react-navigation/native";

interface Props {
  data: InfoItemModel;
  organizerId: string;
  meetingId: string;
  groupId: string;
}

const InfoItem = ({data, organizerId, meetingId, groupId}: Props) => {
  const navigation = useNavigation();
  const ITEM_TOOL = useMemo(() => {
    return {
      meetingTime: {
        fieldName: "Thời gian",
        renderIcon: () => {
          return <ClockGrayIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {},
      },
      repeated: {
        fieldName: "Lặp lại",
        renderIcon: () => {
          return <LoopIcon width={24} height={24} />;
        },
        textAction: "",
        action: async () => {},
      },
      description: {
        fieldName: "Mô tả",
        renderIcon: () => {
          return <ParagraphIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {},
      },
      organizer: {
        fieldName: "Người tổ chức",
        renderIcon: () => {
          return <UserNameIcon width={24} height={24} />;
        },
        textAction: "Chi tiết",
        action: () => {
          navigation.navigate("otherProfile", {userId: organizerId, groupId: groupId});
        },
      },
      place: {
        fieldName: "Địa điểm",
        renderIcon: () => {
          return <MarkerIcon width={24} height={24} />;
        },
        textAction: "",
        action: async () => {},
      },

      attendee: {
        fieldName: "Người tham dự",
        renderIcon: () => {
          return <GroupIcon width={24} height={24} />;
        },
        textAction: "Xem thêm",
        action: async () => {
          navigation.navigate("meetingAttendees", {meetingId: meetingId, groupId: groupId});
        },
      },
    };
  }, [organizerId, meetingId]);

  return (
    <View style={styles.container}>
      <View style={[GlobalStyles.flexRow, {alignItems: "flex-start"}]}>
        <View style={styles.icon}>{ITEM_TOOL[data.type].renderIcon()}</View>
        <SizedBox width={12} />
        <View style={styles.textCtn}>
          <Text style={styles.fieldName}>{ITEM_TOOL[data.type].fieldName}</Text>
          {data.text ? (
            <Text style={styles.text}>{data.text}</Text>
          ) : (
            <Text style={styles.nullText}>Chưa cập nhật</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={ITEM_TOOL[data.type].action}>
        <Text style={styles.textAction}>{ITEM_TOOL[data.type].textAction}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(InfoItem, isEqual);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    paddingTop: 12,
    width: 40,
  },
  fieldName: {
    fontSize: FontSize.normal,
    color: Color.text[4],
    fontWeight: "bold",
  },
  text: {
    fontSize: FontSize.larger,
    color: Color.text[0],
  },
  nullText: {
    fontSize: FontSize.larger,
    color: "#7575757d",
  },
  button: {
    position: "absolute",
    right: 4,
  },
  textAction: {
    color: Color.green,
    fontStyle: "italic",
  },
  textCtn: {
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: Color.gray[2],
    borderBottomWidth: 0.5,
  },
});
