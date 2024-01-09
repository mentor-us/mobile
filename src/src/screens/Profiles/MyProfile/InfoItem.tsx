import {View, Text, TouchableOpacity} from "react-native";
import React, {memo} from "react";
import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {
  EmailIcon,
  ImportantDatesIcon,
  PhoneNumberIcon,
  UserNameIcon,
} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import {LayoutDimensions} from "~/constants/GlobalStyles";
import {Color} from "~/constants/Color";
import isEqual from "react-fast-compare";
import {InfoItemModel} from "./index.props";

const styles = StyleSheet.create({
  button: {
    maxWidth: LayoutDimensions.XLarge,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    // marginVertical: 8,
    marginBottom: LayoutDimensions.Medium,
  },
  field: {
    flexShrink: 1,
  },
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
  nullText: {
    color: "#7575757d",
    fontSize: FontSize.larger,
  },
  text: {
    color: Color.text[1],
    fontSize: FontSize.larger,
  },
  textAction: {
    color: Color.green,
  },
});

const ITEM_TOOL = {
  fullname: {
    fieldName: "Họ và tên",
    renderIcon: () => {
      return (
        <UserNameIcon
          width={LayoutDimensions.Large}
          height={LayoutDimensions.Large}
        />
      );
    },
    textAction: "",
    action: () => {
      console.log("fullname_action");
    },
  },
  year_born: {
    fieldName: "Ngày sinh",
    renderIcon: () => {
      return (
        <ImportantDatesIcon
          width={LayoutDimensions.Large}
          height={LayoutDimensions.Large}
        />
      );
    },
    textAction: "",
    action: () => {
      console.log("year_born_action");
    },
  },
  phomenumber: {
    fieldName: "Số điện thoại",
    renderIcon: () => {
      return (
        <PhoneNumberIcon
          width={LayoutDimensions.Large}
          height={LayoutDimensions.Large}
        />
      );
    },
    textAction: "",
    action: async () => {
      console.log("phomenumber_action");
      // Linking.openURL(`tel:${text}`);
    },
  },
  personal_email: {
    fieldName: "Email cá nhân",
    renderIcon: () => {
      return (
        <EmailIcon
          width={LayoutDimensions.Large}
          height={LayoutDimensions.Large}
        />
      );
    },
    textAction: "",
    action: async () => {
      console.log("email_action");
      // Linking.openURL(`mailto:${data.text}`);
    },
  },
  email: {
    fieldName: "Email",
    renderIcon: () => {
      return (
        <EmailIcon
          width={LayoutDimensions.Large}
          height={LayoutDimensions.Large}
        />
      );
    },
    textAction: "",
    action: async () => {
      console.log("email_action");
      // Linking.openURL(`mailto:${data.text}`);
    },
  },
};

interface InfoItemProps {
  data: InfoItemModel;
}

const InfoItem = ({data: {type, text}}: InfoItemProps) => {
  const Item = ITEM_TOOL[type];

  return (
    <View style={styles.container}>
      <View style={styles.icon}>{Item.renderIcon()}</View>
      <SizedBox width={LayoutDimensions.Medium} />
      <View style={styles.field}>
        <Text style={styles.fieldName}>{Item.fieldName}</Text>
        {text && text !== "N/A" ? (
          <Text style={styles.text}>{text}</Text>
        ) : (
          <Text style={styles.nullText}>Chưa cập nhật</Text>
        )}
      </View>
      {Item.textAction && (
        <TouchableOpacity style={styles.button} onPress={Item.action}>
          <Text style={styles.textAction}>{Item.textAction}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(InfoItem, isEqual);
