import { View, Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import FontSize from "~/constants/FontSize";
import {
  EmailIcon,
  ImportantDatesIcon,
  PhoneNumberIcon,
  UserNameIcon,
} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import { LayoutDimensions } from "~/constants/GlobalStyles";
import { Color } from "~/constants/Color";
import isEqual from "react-fast-compare";
import { InfoItemModel } from "./index.props";
import UserService from "~/services/user";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CurrentUserQueryKey } from "~/app/server/users/queries";

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
  containerInfo: {
    alignItems: "center",
    flexDirection: "row",
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
  textActionDelete: {
    color: Color.red,
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
    action: id => {
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
    action: id => {
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
    action: async id => {
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
    textAction: "X",
    action: async (id = "", email = "") => {
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

const InfoItem = ({ data: { type, text, userId = "" } }: InfoItemProps) => {
  const Item = ITEM_TOOL[type];
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const handleAction = (id, email) => {
    UserService.deleteLinkMail(id, email)
      .then(async res => {
        if (navigation.canGoBack()) {
          // call api get
          // dispatcher(UserThunks.getCurrentUser());
          navigation.goBack();
        }
        await queryClient.refetchQueries({
          queryKey: CurrentUserQueryKey,
        });
        Toast.show("Xoá liên kết email thành công", {
          position: Toast.positions.BOTTOM,
        });
      })
      .catch(err => {
        Toast.show("Xoá liên kết email thất bại", {
          position: Toast.positions.BOTTOM,
        });
      })
      .finally(() => {});
  };
  return (
    <View style={[styles.containerInfo, { justifyContent: "space-between" }]}>
      <View style={[styles.container, { flex: 1 }]}>
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
      </View>
      {Item.textAction && (
        <TouchableOpacity
          style={styles.button}
          onPress={
            type === "personal_email"
              ? () => handleAction(userId, text)
              : () => Item.action(userId)
          }>
          <Text
            style={
              type === "personal_email"
                ? styles.textActionDelete
                : styles.textAction
            }>
            {Item.textAction}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(InfoItem, isEqual);
