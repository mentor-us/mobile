import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  DeviceEventEmitter,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { DefaultUserAvatar, DefaultWallPaperGroup } from "~/assets/images";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";
import { StackNavigationOptions } from "@react-navigation/stack";
import SizedBox from "~/components/SizedBox";
import InfoItem from "./InfoItem";
import { InfoItemModel } from "./index.props";
import Helper from "~/utils/Helper";
import { Colors, FAB, IconButton, Snackbar } from "react-native-paper";
import GroupApi from "~/api/remote/GroupApi";
import { useAppSelector } from "~/redux";
import { Color } from "~/constants/Color";
import EventEmitterNames from "~/constants/EventEmitterNames";
import GradeBoard from "../GradeBoard";
import { RoleType } from "~/models/commonTypes";
import { useGetGroupDetail } from "~/app/server/groups/queries";
import { useCurrentUser, useGetUserDetail } from "~/app/server/users/queries";
import CacheImage from "~/components/CacheImage";
import dayjs from "dayjs";
import RenderHTML from "react-native-render-html";
import { useGetAllNoteOfUserInfinityQuery } from "~/app/server/notes/queries";

const OtherProfile: ScreenProps<"otherProfile"> = ({ route }) => {
  const { userId, groupId } = route.params;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { data: currentUser } = useCurrentUser();
  const { data: profileData } = useGetUserDetail(userId);
  const { data: menteesList } = useGetGroupDetail(
    groupId,
    groupData => groupData.mentees ?? [],
  );
  const { data: isMentor } = useGetGroupDetail(
    groupId,
    groupData => groupData?.role === RoleType.MENTOR || false,
  );
  const {
    data: userNotes,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useGetAllNoteOfUserInfinityQuery(userId, result => {
    return {
      pages: result.pages
        .flatMap(page => page.data)
        .map(note => ({
          pressAction: () => {
            // handleCloseModalPress();
            navigation.navigate("noteDetail", { noteId: note.id });
          },
          title: ({ styles }) => {
            const isVisibledOptions =
              note.isEditable ||
              note.owner.id === currentUser?.id ||
              note.creator.id === currentUser?.id;
            return (
              <>
                <View>
                  <Text
                    style={[
                      styles,
                      { color: "#333", fontSize: 14, fontWeight: "bold" },
                    ]}
                    numberOfLines={1}>
                    {note.title}
                  </Text>
                </View>
                <View
                  style={
                    isVisibledOptions
                      ? {
                          position: "absolute",
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          flexDirection: "row",
                        }
                      : { display: "none" }
                  }>
                  {note.isEditable && (
                    <IconButton
                      icon="note-edit-outline"
                      color={Color.primary}
                      style={
                        (note.owner.id === currentUser?.id ||
                          note.creator.id === currentUser?.id) && {
                          marginRight: 0,
                        }
                      }
                      size={20}
                      onPress={() => {
                        // handleCloseModalPress();
                        navigation.navigate("createOrUpdateNote", {
                          noteId: note.id,
                        });
                      }}
                    />
                  )}

                  {
                    // Only show share button if the user is the owner of the note
                    note.owner.id === currentUser?.id && (
                      <IconButton
                        icon="share-variant-outline"
                        color={Color.primary}
                        style={
                          note.creator.id === currentUser?.id && {
                            marginRight: 0,
                          }
                        }
                        size={20}
                        onPress={() => {
                          console.log("Share note", note.id);
                          // setSelectedNoteId(note.id);
                          // handlePresentModalPress();
                        }}
                      />
                    )
                  }

                  {
                    // Only show delete button if the user is the owner or creator of the note
                    (note.owner.id === currentUser?.id ||
                      note.creator.id === currentUser?.id) && (
                      <IconButton
                        icon="trash-can-outline"
                        color={Colors.red500}
                        size={20}
                        // onPress={() => onDeleteNoteClick(note.id)}
                      />
                    )
                  }
                </View>
              </>
            );
          },
          description: () => {
            const isVisibledOptions =
              note.isEditable ||
              note.owner.id === currentUser?.id ||
              note.creator.id === currentUser?.id;
            return (
              <View style={isVisibledOptions ? { marginBottom: 26 } : {}}>
                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: note.content,
                  }}
                />
              </View>
            );
          },
          time: {
            content: dayjs(note.createdDate).format("DD/MM/YYYY"),
            style: {
              paddingTop: 8,
              color: "#666",
              fontSize: 13,
            },
          },
          icon: () => (
            <View>
              <CacheImage
                url={Helper.getImageUrl(note.creator.imageUrl)}
                // style={styles.timelineAvatarStyle}
              />
            </View>
          ),
        })),
      pageParams: result.pageParams,
    } as any;
  });

  console.log("data", userNotes);
  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      { type: "fullname", text: profileData?.name },
      { type: "email", text: profileData?.email },
      { type: "personalEmail", text: profileData?.personalEmail },
      {
        type: "year_born",
        text: Helper.formatDate(profileData?.birthDate || ""),
      },
      { type: "phomenumber", text: profileData?.phone },
    ] as InfoItemModel[];
  }, [profileData]);

  // UI state
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  // Action
  const openChat = async () => {
    if (!currentUser?.id) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }

    if (!profileData?.id) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }

    const data = {
      channelName: "",
      description: "",
      groupId: groupId,
      creatorId: currentUser?.id,
      type: "PRIVATE_MESSAGE",
      userIds: [currentUser?.id, profileData.id],
    };
    const newChannel = await GroupApi.addChannel(data);
    if (!newChannel) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }
    navigation.navigate("chat", { groupId: newChannel.id });

    DeviceEventEmitter.emit(EventEmitterNames.refreshWorkspace, {
      status: true,
      message: "Đã cập nhật kênh",
    });
  };

  const createNote = async () => {
    const canNoteCreateNoteMessage = "Không thể tạo ghi chú cho người này!";
    if (!currentUser?.id || !profileData?.id) {
      setMessage(canNoteCreateNoteMessage);
      setSnackBar(true);
      return;
    }

    navigation.navigate("createOrUpdateNote", { userIds: [profileData?.id] });
  };

  useEffect(() => {
    navigation.setOptions({
      title: profileData?.name,
    } as StackNavigationOptions);
  }, [profileData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatar_coverphoto_ctn}>
          {/* Wallpaper */}
          <View style={styles.coverphoto_ctn}>
            <Image style={styles.coverphoto} source={DefaultWallPaperGroup} />
          </View>
          {/* Avatar */}
          <View style={styles.avatar_ctn}>
            <Image
              style={styles.avatar}
              source={
                profileData?.imageUrl
                  ? { uri: profileData.imageUrl }
                  : DefaultUserAvatar
              }
            />
          </View>
        </View>

        {/* Infor */}
        <View style={styles.infoCtn}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Thông tin</Text>
          </View>
          <SizedBox height={8} />
          {infoItems.map(item => {
            return <InfoItem data={item} key={item.type} />;
          })}
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Bảng điểm</Text>
          </View>
          <GradeBoard user={profileData} />
        </View>

        {/* <View style={{ marginHorizontal: 16, marginTop: 8 }}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Danh sách ghi chú</Text>
          </View>
          <SizedBox height={8} /> */}
        {/* {infoItems.map(item => {
            return <InfoItem data={item} key={item.type} />;
          })} */}
        {/* <Timeline
            data={data?.pages || []}
            lineStyle={{ backgroundColor: Color.primary }}
            timeContainerStyle={styles.timelineTimeContainerStyle}
            contentContainerStyle={styles.timelineContentContainerStyle}
            TimelineHeader={TimelineHeader}
            TimelineFooter={() =>
              isLoading || isFetchingNextPage ? (
                <LoadingComponent />
              ) : (
                <EmptyComponent />
              )
            }
            onEndReachedThreshold={0.8}
            onEndReached={hasNextPage ? fetchNextPage : undefined}
          /> */}
        {/* </View> */}
      </ScrollView>

      {currentUser?.id !== userId && (
        <FAB
          icon="message-reply-text-outline"
          style={{
            backgroundColor: Color.backgroundChat,
            position: "absolute",
            bottom: 2,
            right: 2,
            elevation: 0,
            shadowOpacity: 0,
            marginRight: 16,
            marginBottom: 16,
            zIndex: 100,
          }}
          color={Color.black}
          small
          label={"Nhắn tin"}
          onPress={openChat}
          uppercase={false}
        />
      )}

      {currentUser?.id !== userId &&
        isMentor &&
        menteesList?.findIndex(id => id === userId) !== -1 && (
          <FAB
            icon="note-edit-outline"
            style={{
              backgroundColor: Color.backgroundChat,
              position: "absolute",
              bottom: 2,
              right: 140,
              elevation: 0,
              shadowOpacity: 0,
              marginRight: 16,
              marginBottom: 16,
              zIndex: 100,
            }}
            color={Color.black}
            small
            label={"Tạo ghi chú"}
            onPress={createNote}
            uppercase={false}
          />
        )}

      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default OtherProfile;
