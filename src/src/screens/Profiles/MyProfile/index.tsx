import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";

import React, { useEffect, useMemo, useState } from "react";
import { DefaultUserAvatar, DefaultWallPaperGroup } from "~/assets/images";
import styles, { AVATAR_SIZE } from "./styles";
import { CameraIcon } from "~/assets/svgs";
import GlobalStyles, { LayoutDimensions } from "~/constants/GlobalStyles";
import InfoItem from "./InfoItem";
import { InfoItemModel } from "./index.props";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { useAppDispatch } from "~/redux";
import Helper from "~/utils/Helper";
import { HeaderRight } from "~/components/Header";
import NotificationApi from "~/api/remote/NotificationApi";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { StorageMediaAttachemt } from "~/models/media";
import ToolApi from "~/api/remote/ToolApi";
import { UserActions } from "~/redux/features/user/slice";
import { SecureStore } from "~/api/local/SecureStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "~/app/server/users/queries";
import Permission from "~/utils/PermissionStrategies";
import { observer } from "mobx-react-lite";
import { useMobxStore } from "~/mobx/store";
import CacheImage from "~/components/CacheImage";
import FastImage from "react-native-fast-image";
import GradeBoard from "../GradeBoard";
import { MAX_SIZE_IMG } from "~/constants";
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker";
import SingleThumbnail from "~/components/SingleThumbnail";
import { CurrentUserQueryKey } from "~/app/server/users/keys";
import { UserProfileModel } from "~/models/user";
import FontSize from "~/constants/FontSize";
import { Text } from "react-native-paper";

const MyProfile = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { authStore } = useMobxStore();
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();
  const queryClient = useQueryClient();
  const [loadingWallpaper, setLoadingWallpaper] = useState<boolean>(false);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

  const { data: myProfile, refetch: refetchMyProfile } = useCurrentUser();

  const infoItems: InfoItemModel[] = useMemo(() => {
    if (!myProfile) return [] as InfoItemModel[];

    return [
      { type: "fullname", text: myProfile?.name },
      { type: "email", text: myProfile?.email },
      {
        type: "year_born",
        text: Helper.formatDate(myProfile?.birthDate ?? ""),
      },
      { type: "phomenumber", text: myProfile?.phone },
    ] as InfoItemModel[];
  }, [myProfile]);

  const logout = async () => {
    if (myProfile) {
      await NotificationApi.updateToken(myProfile.id, "");
    }

    await SecureStore.removeToken();
    authStore.signOut();
    queryClient.clear();
  };

  const editProfile = () => navigation.navigate("editProfile");
  const editLinkEmail = () => navigation.navigate("linkEmail");

  const updateAvatar = async () => {
    const hasPermission = await Permission.handleReadStoragePermission();
    if (hasPermission) {
      const options: ImageLibraryOptions = {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        selectionLimit: 1,
        presentationStyle: "fullScreen",
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          setLoadingAvatar(false);
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          setLoadingAvatar(false);
          console.error("Image picker error: ", response.errorMessage);
        } else {
          const selectedMedia = Helper.formatMediaListMirage(
            response.assets || [],
          );

          if (
            selectedMedia.some(item => item.size && item.size > MAX_SIZE_IMG)
          ) {
            Alert.alert(
              "Cảnh báo",
              `Kích thước ảnh vượt quá ${Helper.formatFileSize(MAX_SIZE_IMG)}`,
            );
            return;
          }

          setLoadingAvatar(true);
          ToolApi.updateAvatar(selectedMedia[0]).then(async data => {
            if (data) {
              await refetchMyProfile();
              dispatcher(UserActions.updateAvatar(data));
              queryClient.setQueryData<UserProfileModel>(
                CurrentUserQueryKey,
                oldData => {
                  return { ...oldData, imageUrl: data };
                },
              );
            }
            setLoadingAvatar(false);
          });
        }
      });
    }
  };

  const updateWallpaper = async () => {
    setLoadingWallpaper(true);
    const hasPermission = await Permission.handleReadStoragePermission();

    if (hasPermission) {
      BottomSheetModalRef.current?.show("gallery", false, {
        run: async (image: StorageMediaAttachemt) => {
          const data = await ToolApi.updateWallpaper(image);
          if (data) {
            await refetchMyProfile();
            dispatcher(UserActions.updateWallpaper(data));
          }
          setLoadingWallpaper(false);
        },
        cancel: () => {
          setLoadingWallpaper(false);
        },
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onPress={logout} text={"Đăng xuất"} />,
    } as Partial<StackNavigationOptions>);
  }, []);

  if (!myProfile) {
    return null;
  }

  const viewPersonalEmails = () => {
    const listData: any =
      myProfile?.additionalEmails?.map((email, index) => {
        return {
          type: "personal_email",
          text: email ?? "",
          userId: myProfile?.id,
          key: "view_personal_email" + index,
        };
      }) ?? [];

    return (
      <View
        style={{
          padding: 7,
        }}>
        <FlatList
          data={listData}
          renderItem={({ item }) => {
            return <InfoItem data={item} />;
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={GlobalStyles.fullFlex} bounces={false}>
        <View style={styles.avatar_coverphoto_ctn}>
          {/* Wallpaper */}
          <View style={styles.coverphoto_ctn}>
            <CacheImage
              style={styles.coverphoto}
              url={Helper.getImageUrl(myProfile.wallpaper)}
              defaultSource={DefaultWallPaperGroup}
              resizeMode={FastImage.resizeMode.cover}
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
                  url: Helper.getImageUrl(myProfile.imageUrl),
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
        {/* Info */}
        <View style={styles.infoCtn}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Thông tin của bạn</Text>
            <TouchableOpacity onPress={editProfile}>
              <Text style={styles.editText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
          <SizedBox height={LayoutDimensions.Small} />
          <View style={{ padding: 7 }}>
            {infoItems.map(item => {
              return <InfoItem data={item} key={item.type} />;
            })}
          </View>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Bảng điểm</Text>
          </View>
          <GradeBoard user={myProfile} />
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Email đã liên kết</Text>
            <TouchableOpacity onPress={editLinkEmail}>
              <Text style={styles.editText}>Thêm email</Text>
            </TouchableOpacity>
          </View>

          {myProfile?.additionalEmails &&
          myProfile.additionalEmails.length !== 0 ? (
            viewPersonalEmails()
          ) : (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 8,
              }}>
              <Text style={{ fontSize: FontSize.large }}>
                Chưa cập nhật Email liên kết
              </Text>
            </View>
          )}

          {/* <View style={[styles.infoHeader,{ }]}>
            <InfoItem data={{ type: "personal_email", text: "thong",userId: myProfile?.id}} key={"personal_email"} />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(MyProfile);
