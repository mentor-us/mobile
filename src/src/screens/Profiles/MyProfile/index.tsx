import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DefaultUserAvatar, DefaultWallPaperGroup} from "~/assets/images";
import styles, {AVATAR_SIZE} from "./styles";
import {CameraIcon} from "~/assets/svgs";
import GlobalStyles from "~/constants/GlobalStyles";
import InfoItem from "./InfoItem";
import {InfoItemModel} from "./index.props";
import SizedBox from "~/components/SizedBox";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationOptions} from "@react-navigation/stack";
import {useAppDispatch, useAppSelector} from "~/redux";
import AuthThunk from "~/redux/features/auth/thunk";
import Helper from "~/utils/Helper";
import {HeaderRight} from "~/components/Header";
import NotificationApi from "~/api/remote/NotificationApi";
import {BottomSheetModalRef} from "~/components/BottomSheetModal/index.props";
import {StorageMediaAttachemt} from "~/models/media";
import ToolApi from "~/api/remote/ToolApi";
import {UserActions} from "~/redux/features/user/slice";
import {handleReadStoragePermission} from "~/utils/Permission";
import SingleThumbnail from "~/components/SingleThumbnail";
import {screenWidth} from "~/constants";

const MyProfile = () => {
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.data);
  const [loadingWallpaper, setLoadingWallpaper] = useState<boolean>(false);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      {type: "fullname", text: currentUser.name},
      {type: "email", text: currentUser.email},
      {type: "personal_email", text: currentUser.personalEmail},
      {type: "year_born", text: Helper.formatDate(currentUser.birthDate)},
      {type: "phomenumber", text: currentUser.phone},
    ] as InfoItemModel[];
  }, [currentUser]);

  const logout = useCallback(async () => {
    await NotificationApi.updateToken(currentUser.id, "");
    dispatcher(AuthThunk.logout());
  }, []);

  const editProfile = useCallback(() => {
    navigation.navigate("editProfile");
  }, []);

  const renderLogoutButton = useCallback(() => {
    return <HeaderRight onPress={logout} text={"Đăng xuất"} />;
  }, []);

  const updateAvatar = async () => {
    try {
      setLoadingAvatar(true);
      const hasPermission = await handleReadStoragePermission();
      if (hasPermission) {
        BottomSheetModalRef.current?.show("gallery", false, {
          run: async (image: StorageMediaAttachemt) => {
            const data = await ToolApi.updateAvatar(image);
            if (data) {
              dispatcher(UserActions.updateAvatar(data));
            }
            setLoadingAvatar(false);
          },
          cancel: () => {
            setLoadingAvatar(false);
          },
        });
      }
    } catch (error) {
      console.log("@ERROR_PERMISSION: handleReadStoragePermission");
    }
  };

  const updateWallpaper = async () => {
    try {
      setLoadingWallpaper(true);
      const hasPermission = await handleReadStoragePermission();
      if (hasPermission) {
        BottomSheetModalRef.current?.show("gallery", false, {
          run: async (image: StorageMediaAttachemt) => {
            const data = await ToolApi.updateWallpaper(image);
            if (data) {
              dispatcher(UserActions.updateWallpaper(data));
            }
            setLoadingWallpaper(false);
          },
          cancel: () => {
            setLoadingWallpaper(false);
          },
        });
      }
    } catch (error) {
      console.log("@ERROR_PERMISSION: handleReadStoragePermission");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderLogoutButton,
    } as Partial<StackNavigationOptions>);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={GlobalStyles.fullFlex} bounces={false}>
        <View style={styles.avatar_coverphoto_ctn}>
          {/* Wallpaper */}
          <View style={styles.coverphoto_ctn}>
            <SingleThumbnail
              style={styles.coverphoto}
              media={{
                type: "IMAGE",
                url: currentUser.wallpaper,
                assetLocal: DefaultWallPaperGroup,
                isLoading: loadingWallpaper,
              }}
              width={screenWidth}
              height={screenWidth / 2.5}
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={updateWallpaper}>
              <CameraIcon />
            </TouchableOpacity>
          </View>
          {/* Avatar */}
          <View style={styles.avatar_ctn}>
            <View style={styles.avatar}>
              <SingleThumbnail
                media={{
                  type: "IMAGE",
                  url: currentUser.imageUrl,
                  assetLocal: DefaultUserAvatar,
                  isLoading: loadingAvatar,
                }}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
              />
            </View>
            <TouchableOpacity style={styles.cameraIcon} onPress={updateAvatar}>
              <CameraIcon />
            </TouchableOpacity>
          </View>
        </View>
        {/* Infor */}
        <View style={styles.infoCtn}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Thông tin của bạn</Text>
            <TouchableOpacity onPress={editProfile}>
              <Text style={styles.editText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
          <SizedBox height={8} />
          {infoItems.map(item => {
            return <InfoItem data={item} key={item.type} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfile;
