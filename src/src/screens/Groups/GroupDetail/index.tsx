import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import GroupService from "~/services/group";
import { StackNavigationOptions } from "@react-navigation/stack";
import GlobalStyles from "~/constants/GlobalStyles";
import { DefaultGroupAvatar } from "~/assets/images";
import InfoItem from "./InfoItem";
import { InfoItemModel } from "./index.props";
import { Line } from "~/components/Separator";
import { Color } from "~/constants/Color";
import { HeaderBackButton } from "~/components/Header";
import styles, { AVATAR_SIZE } from "./styles";
import GroupApi from "~/api/remote/GroupApi";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";
import { CameraIcon } from "~/assets/svgs";
import { handleReadStoragePermission } from "~/utils/Permission";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { StorageMediaAttachemt } from "~/models/media";
import ToolApi from "~/api/remote/ToolApi";
import SingleThumbnail from "~/components/SingleThumbnail";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import FastImage from "react-native-fast-image";
import { useGetGroupDetail } from "~/app/server/groups/queries";
import Permission from "~/utils/PermissionStrategies";

const GroupDetail: ScreenProps<"groupDetail"> = ({ route }) => {
  const navigation = useNavigation();
  const { groupId, type } = route.params;

  // State
  const [groupData, setGroupData] = useState<GroupModel>(GROUP_SAMPLE);
  const queryAction = useUpdateQueryGroupList();
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const {
    data: parentDetail,
    isLoading: isLoadingParentDetail,
    isSuccess: isSuccessParentDetail,
    refetch: refetchParentDetail,
  } = useGetGroupDetail(groupData.parentId ?? "");

  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      { text: `Bộ sưu tập ảnh, tập tin đã gửi`, type: "media" },
      { text: `Xem thành viên (${groupData.totalMember})`, type: "attendee" },
      ...(groupData.permissions?.includes("MEETING_MANAGEMENT")
        ? [{ text: `Lịch hẹn`, type: "meeting" }]
        : []),
      ...(groupData.permissions?.includes("TASK_MANAGEMENT")
        ? [{ text: `Danh sách công việc`, type: "task" }]
        : []),
      ...(groupData.permissions?.includes("BOARD_MANAGEMENT")
        ? [{ text: `Bảng tin`, type: "notes" }]
        : []),
      ...(groupData.permissions?.includes("FAQ_MANAGEMENT")
        ? [{ text: `FAQ`, type: "faq" }]
        : []),
    ] as InfoItemModel[];
  }, [groupData]);

  const groupSettings: InfoItemModel[] = [
    {
      text: `Ghim nhóm`,
      type: "pin",
      switchStatus: groupData.pinned,
      triggerAction: () => pinAction(groupId),
    },
    // {text: `Thông báo`, type: "isNoti"},
  ] as InfoItemModel[];

  // Action
  const pinAction = async (groupId: string) => {
    try {
      if (groupData.pinned) {
        await GroupApi.unpinGroup(groupId);
      } else {
        await GroupApi.pinGroup(groupId);
      }

      setGroupData(prev => {
        return {
          ...prev,
          pinned: !prev.pinned,
        };
      });

      queryAction.updateGroupPinned(groupId, !groupData.pinned);
    } catch (error) {
      console.log("@SCREEN_GROUP_DETAIL");
    }
  };

  const initHeader = () => {
    navigation.setOptions({
      title: groupData.groupCategory,
      // headerRight,
      headerLeft,
    } as StackNavigationOptions);
  };

  const fetchGroupData = async (groupId: string) => {
    try {
      const data: GroupModel = await GroupService.findById(groupId);
      setGroupData(data);
    } catch (error) {
      console.log("@SCREEN_GroupDetail: ", error);
    }
  };

  const updateAvatar = async () => {
    try {
      setLoadingAvatar(true);
      const hasPermission = await Permission.handleWriteStoragePermission();
      if (hasPermission) {
        BottomSheetModalRef.current?.show("gallery", false, {
          run: async (image: StorageMediaAttachemt) => {
            const data = await ToolApi.updateGroupAvatar(image, groupData.id);
            setGroupData(prev => ({ ...prev, imageUrl: data }));
            queryAction.updateGroupAvatar(groupData.id, data);
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

  // Side effec
  useEffect(() => {
    fetchGroupData(groupId);
  }, [groupId]);

  useEffect(() => {
    initHeader();
  }, [groupData]);

  const headerLeft = useCallback(() => {
    return <HeaderBackButton canGoBack />;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={GlobalStyles.fullFlex} bounces={false}>
        <View style={styles.avatar_coverphoto_ctn}>
          <View style={styles.avatar_ctn}>
            <View style={styles.avatar}>
              <CacheImage
                url={Helper.getImageUrl(
                  groupData.imageUrl ?? parentDetail?.imageUrl,
                )}
                defaultSource={DefaultGroupAvatar}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            </View>

            {type === "group" && groupData.imageUrl && (
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={updateAvatar}>
                <CameraIcon />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.descriptionCtn}>
            <Text style={[styles.groupCategory, { fontWeight: "bold" }]}>
              {groupData.name === "General"
                ? "Cuộc trò chuyện chung"
                : groupData.name}
            </Text>
            {groupData.description && (
              <Text numberOfLines={3} style={styles.description}>
                {groupData.description}
              </Text>
            )}
          </View>
        </View>
        <Line height={8} color={Color.gray[0]} />
        {/* Infor */}
        <View style={styles.infoCtn}>
          {infoItems.map(item => {
            return (
              <InfoItem
                role={groupData.role}
                group={groupData}
                data={item}
                key={item.type}
              />
            );
          })}
        </View>

        {groupData.permissions?.includes("GROUP_SETTINGS") &&
          type === "group" &&
          groupData.imageUrl && (
            <>
              <Line height={8} color={Color.gray[0]} />
              {/* Group Setting */}
              <View style={styles.infoCtn}>
                {groupSettings.map(item => {
                  return (
                    <InfoItem
                      role={groupData.role}
                      group={groupData}
                      data={item}
                      key={item.type}
                    />
                  );
                })}
              </View>
            </>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupDetail;
