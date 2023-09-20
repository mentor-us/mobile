import {View, Text, TouchableOpacity, Linking} from "react-native";
import React, {memo, useMemo} from "react";
import {StyleSheet} from "react-native";
import FontSize from "~/constants/FontSize";
import {
  EmailIcon,
  ImportantDatesIcon,
  PhoneNumberIcon,
  UserNameIcon,
} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import {Color} from "~/constants/Color";
import isEqual from "react-fast-compare";
import {InfoItemModel} from "./index.props";
import {screenWidth} from "~/constants";

interface Props {
  data: InfoItemModel;
}

const InfoItem = ({data}: Props) => {
  const ITEM_TOOL = useMemo(() => {
    return {
      fullname: {
        fieldName: "Họ và tên",
        renderIcon: () => {
          return <UserNameIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {
          console.log("fullname_action");
        },
      },
      year_born: {
        fieldName: "Ngày sinh",
        renderIcon: () => {
          return <ImportantDatesIcon width={24} height={24} />;
        },
        textAction: "",
        action: () => {
          console.log("year_born_action");
        },
      },
      phomenumber: {
        fieldName: "Số điện thoại",
        renderIcon: () => {
          return <PhoneNumberIcon width={24} height={24} />;
        },
        textAction: data.text && "Liên lạc",
        action: async () => {
          console.log("phomenumber_action");
          Linking.openURL(`tel:${data.text}`);
        },
      },
      email: {
        fieldName: "Email",
        renderIcon: () => {
          return <EmailIcon width={24} height={24} />;
        },
        textAction: data.text && "Gửi mail",
        action: async () => {
          console.log("email_action");
          Linking.openURL(`mailto:${data.text}`);
        },
      },
      personalEmail: {
        fieldName: "Email cá nhân",
        renderIcon: () => {
          return <EmailIcon width={24} height={24} />;
        },
        textAction: data.text && "Gửi mail",
        action: async () => {
          console.log("email_action");
          Linking.openURL(`mailto:${data.text}`);
        },
      },
    };
  }, [data.text]);

  return (
    <View style={styles.container}>
      <View style={GlobalStyles.flexRow}>
        <View style={styles.icon}>{ITEM_TOOL[data.type].renderIcon()}</View>
        <SizedBox width={12} />
        <View>
          <Text style={styles.fieldName}>{ITEM_TOOL[data.type].fieldName}</Text>
          {data.text && data.text != "N/A" ? (
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
    marginVertical: 8,
  },
  icon: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: Color.gray[1],
  },
  fieldName: {
    fontSize: FontSize.normal,
    color: Color.text[2],
    fontWeight: "bold",
  },
  text: {
    fontSize: FontSize.larger,
    color: Color.text[1],
    width: screenWidth - 170,
  },
  nullText: {
    fontSize: FontSize.larger,
    color: "#7575757d",
    width: screenWidth - 170,
  },
  button: {},
  textAction: {
    color: Color.green,
  },
});
