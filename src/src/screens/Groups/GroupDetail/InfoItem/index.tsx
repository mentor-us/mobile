import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useMemo } from "react";

import {
  CalendarIcon,
  GalleryIcon,
  GroupIcon,
  NotiIcon,
  PinIcon,
  TaskListIcon,
  UserNameIcon,
  ChartIcon,
  FaqIcon,
} from "~/assets/svgs";

import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import isEqual from "react-fast-compare";
import { InfoItemModel } from "../index.props";

import styles from "./styles";
import { Switch } from "react-native-paper";
import { Color } from "~/constants/Color";
import { useNavigation } from "@react-navigation/native";
import { RoleType } from "~/models/commonTypes";
import { GroupModel } from "~/models/group";

interface Props {
  data: InfoItemModel;
  group: GroupModel;
  role: RoleType;
}

const InfoItem = ({ data, role, group }: Props) => {
  const navigation = useNavigation();
  const ITEM_TOOL = useMemo(() => {
    return {
      attendee: {
        renderIcon: () => {
          return <GroupIcon width={24} height={22} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupAttendees", {
            groupId: group.id,
            role: role,
          });
        },
      },
      media: {
        renderIcon: () => {
          return <GalleryIcon width={24} height={20} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupMedia", {
            groupId: group.id,
            mode: "images",
          });
        },
      },
      meeting: {
        renderIcon: () => {
          return <CalendarIcon width={24} height={24} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupSchedule", {
            groupId: group.id,
            mode: "meeting",
            role: role,
          });
        },
      },
      task: {
        renderIcon: () => {
          return <TaskListIcon width={24} height={24} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupSchedule", {
            groupId: group.id,
            mode: "task",
            role: role,
          });
        },
      },
      pin: {
        renderIcon: () => {
          return <PinIcon width={24} height={24} />;
        },
        renderSwitch: () => {
          return <Switch color={Color.primary} value={data.switchStatus} />;
        },
        action: data.triggerAction,
      },
      isNoti: {
        renderIcon: () => {
          return <NotiIcon width={24} height={24} />;
        },
        renderSwitch: () => {
          return <Switch value={data.switchStatus} />;
        },
        action: () => {},
      },
      faq: {
        renderIcon: () => {
          return <FaqIcon width={24} height={20} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupFAQ", { groupId: group?.parentId || "" });
        },
      },
      notes: {
        renderIcon: () => {
          return <ChartIcon width={24} height={20} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {
          navigation.navigate("groupNote", { groupId: group.id });
        },
      },
      notification_list: {
        renderIcon: () => {
          return <UserNameIcon width={24} height={24} />;
        },
        renderSwitch: () => {
          return <View />;
        },
        action: () => {},
      },
    };
  }, [data.switchStatus, role, group]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={ITEM_TOOL[data.type].action}>
      <View style={GlobalStyles.flexRow}>
        <View style={styles.icon}>{ITEM_TOOL[data.type].renderIcon()}</View>
        <SizedBox width={12} />
        <View style={styles.textCtn}>
          <Text style={styles.text}>{data.text}</Text>
        </View>
      </View>
      <View style={styles.switchCtn}>
        {ITEM_TOOL[data.type].renderSwitch()}
        <View style={styles.dumb} />
      </View>
    </TouchableOpacity>
  );
};

export default memo(InfoItem, isEqual);
