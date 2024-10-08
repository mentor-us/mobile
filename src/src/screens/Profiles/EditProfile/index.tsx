import { Alert, Keyboard, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { HeaderSubmitButton } from "~/components/Header";
import styles from "./styles";
import TextInputForm from "~/components/TextInputForm";
import { useForm } from "react-hook-form";
import DatePicker from "react-native-date-picker";
import Helper from "~/utils/Helper";
import { useAppDispatch } from "~/redux";
import { UserProfileModel } from "~/models/user";
import UserThunks from "~/redux/features/user/thunk";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "~/app/server/users/queries";
import { Chase } from "react-native-animated-spinkit";
import { Color } from "~/constants/Color";
import { CurrentUserQueryKey } from "~/app/server/users/keys";
import { PHONE_NUMBER_REGEX } from "~/constants";

const EditProfile = () => {
  const { data: userData, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    name: yup.string().required("Họ tên không được để trống"),
    personalEmail: yup.string().email("Email không hợp lệ"),
    phone: yup.string().nullable().matches(PHONE_NUMBER_REGEX, {
      message: "Số điện thoại không hợp lệ",
      excludeEmptyString: true,
    }),
  });

  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const birthdayRef = useRef<any>();

  // const userData = useAppSelector(state => state.user.data);
  const dispatcher = useAppDispatch();

  const onDone = async data => {
    const newProfile: UserProfileModel = {
      ...userData,
      ...data,
      birthDate: Helper.createDate(data.birthDate),
    };

    dispatcher(UserThunks.updateProfile(newProfile));

    await queryClient.refetchQueries({
      queryKey: CurrentUserQueryKey,
    });

    await queryClient.invalidateQueries({
      queryKey: CurrentUserQueryKey,
    });

    navigation.goBack();
  };

  const headerRight = useCallback(() => {
    return <HeaderSubmitButton onPress={handleSubmit(onDone)} />;
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerRight } as StackNavigationOptions);
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>Đang tải...</Text>
          <Chase color={Color.primary} />
        </View>
      ) : (
        <>
          <TextInputForm
            name="name"
            label="Họ và tên"
            control={control}
            keyboardType={"default"}
            defaultValue={userData?.name}
            errorText={errors.name && `${errors.name?.message}`}
          />
          <TextInputForm
            ref={birthdayRef}
            name="birthDate"
            label="Ngày sinh (dd/mm/yyyy)"
            control={control}
            keyboardType={"number-pad"}
            onFocus={() => {
              setOpenDatePicker(true);
            }}
            defaultValue={
              Helper.formatDate(userData?.birthDate ?? "") !== "N/A"
                ? Helper.formatDate(userData?.birthDate ?? "")
                : ""
            }
          />
          <TextInputForm
            name="phone"
            label="Số điện thoại"
            control={control}
            keyboardType={"number-pad"}
            defaultValue={userData?.phone}
            errorText={errors.phone && `${errors.phone.message}`}
          />
          <DatePicker
            modal
            open={openDatePicker}
            title={"Chọn ngày sinh"}
            date={
              birthdayRef.current?.getText()
                ? moment(birthdayRef.current?.getText(), "DD/MM/YYYY").toDate()
                : new Date()
            }
            onConfirm={date => {
              const now = new Date();
              if (date > now) {
                Alert.alert(
                  "Chọn ngày sinh",
                  "Vui lòng chọn ngày sinh trong quá khứ!",
                );
                setOpenDatePicker(false);
                Keyboard.dismiss();
                return;
              }
              setOpenDatePicker(false);
              birthdayRef.current.setText(Helper.formatDate(date.toString()));
              Keyboard.dismiss();
            }}
            onCancel={() => {
              setOpenDatePicker(false);
              Keyboard.dismiss();
            }}
            mode="date"
            locale="vi"
            cancelText="Hủy"
            confirmText="Xác nhận"
          />
        </>
      )}
    </View>
  );
};

export default EditProfile;
