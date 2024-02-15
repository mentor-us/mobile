import { Alert, Keyboard, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { HeaderRight, HeaderSubmitButton } from "~/components/Header";
import styles from "./styles";
import TextInputForm from "~/components/TextInputForm";
import { useForm } from "react-hook-form";
import DatePicker from "react-native-date-picker";
import Helper from "~/utils/Helper";
import { useAppDispatch, useAppSelector } from "~/redux";
import { UserProfileModel } from "~/models/user";
import UserThunks from "~/redux/features/user/thunk";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import UserService from "~/services/user";
import Toast from "react-native-root-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CurrentUserQueryKey } from "~/app/server/users/queries";

// export interface FormModel {
//   name: string;
//   birthDay: string;
//   personalEmail: string;
//   phone: string;
// }
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const LinkEmail = () => {
  const queryClient = useQueryClient();
  const schema = yup.object().shape({
    personalEmail: yup.string().email("Email không hợp lệ")
    .required("Mail is required")
    .test("is-valid", (message) => `Email không hợp lệ`, (value) => value ? validateEmail(value) : new yup.ValidationError("Email không hợp lệ")),
  });

  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const userData = useAppSelector(state => state.user.data);
  const dispatcher = useAppDispatch();

  const onDone = data => {
    // handle submit
    // UserApi.updateLinkMail(data.id,data.email);
    UserService.updateLinkMail(userData.id, data.personalEmail)
      .then(async res => {
        if (navigation.canGoBack()) {
          // call api get
          // dispatcher(UserThunks.getCurrentUser());
          navigation.goBack();
        }
        await queryClient.refetchQueries({
          queryKey: CurrentUserQueryKey,
        });
        Toast.show(res, {
          position: Toast.positions.BOTTOM,
        });
      })
      .catch(err => {
        Toast.show("Liên kết email thất bại", {
          position: Toast.positions.BOTTOM,
        });
      })
      .finally(() => {});
  };

  const headerRight = useCallback(() => {
    return <HeaderSubmitButton onPress={handleSubmit(onDone)} />;
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerRight } as StackNavigationOptions);
  });

  return (
    <View style={styles.container}>
      <TextInputForm
        name="personalEmail"
        label="Email cá nhân"
        control={control}
        keyboardType={"email-address"}
        defaultValue={userData.personalEmail}
        errorText={errors.personalEmail && `${errors.personalEmail.message}`}
      />
    </View>
  );
};

export default LinkEmail;
