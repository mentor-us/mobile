import React, { useCallback, useContext, useMemo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { ScreenProps } from "~/types/navigation";
import { useGetAllNoteOfUserInfinityQuery } from "~/app/server/notes/queries";
import { Timeline } from "react-native-just-timeline";
import dayjs from "dayjs";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import { Color } from "~/constants/Color";
import { Chase } from "react-native-animated-spinkit";
import { NotiFailed } from "~/assets/svgs";
import { Avatar, Button, Card, Colors, IconButton } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import {
  useDeleteNoteMutation,
  useShareNoteMutation,
} from "~/app/server/notes/mutation";
import { AppContext } from "~/context/app";
import AppLoadingIndicator from "~/components/AppLoadingIndicator";
import AppErrorModal from "~/components/AppErrorModal";
import {
  useCurrentUser,
  useSearchAllUsersByEmail,
} from "~/app/server/users/queries";
import {
  BottomSheetTextInput,
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetVirtualizedList,
} from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NotePermission, NoteShareType, ShareNoteRequest } from "~/models/note";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import FontSize from "~/constants/FontSize";
import CustomBackdrop from "../CustomBottomSheet/CustomBackdrop";
import ShareTypeBottomSheet from "../ShareTypeBottomSheet";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import GlobalStyles from "~/constants/GlobalStyles";
import { DefaultUserAvatar } from "~/assets/images";
import SharePermissionBottomSheet from "../SharePermissionBottomSheet";
import { RefreshControl } from "react-native";

interface ViewNoteUserAccess {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  permission: NotePermission;
}

const UserNotes: ScreenProps<"userNotes"> = ({ navigation, route }) => {
  const { setIsLoading } = useContext(AppContext);
  const { data: myId } = useCurrentUser(profile => profile.id);
  const { width } = useWindowDimensions();
  const { userId } = route.params;
  const [selectedUserIndex, setSelectedUserIndex] = React.useState<number>(0);
  const [selectedNoteId, setSelectedNoteId] = React.useState<string>("");
  const [searchEmailQuery, setSearchEmailQuery] = React.useState<string>("");
  const { data: usersResult } = useSearchAllUsersByEmail();
  const { mutateAsync, isError, error, reset } = useDeleteNoteMutation(userId);
  const { mutateAsync: shareNoteAsync } = useShareNoteMutation(userId);
  const {
    data,
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
            handleCloseModalPress();
            navigation.navigate("noteDetail", { noteId: note.id });
          },
          title: ({ styles }) => (
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
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "row",
                }}>
                {note.isEditable && (
                  <IconButton
                    icon="note-edit-outline"
                    color={Color.primary}
                    style={
                      (note.owner.id === myId || note.creator.id === myId) && {
                        marginRight: 0,
                      }
                    }
                    size={20}
                    onPress={() => {
                      handleCloseModalPress();
                      navigation.navigate("createOrUpdateNote", {
                        noteId: note.id,
                      });
                    }}
                  />
                )}

                {
                  // Only show share button if the user is the owner of the note
                  note.owner.id === myId && (
                    <IconButton
                      icon="share-variant-outline"
                      color={Color.primary}
                      style={note.creator.id === myId && { marginRight: 0 }}
                      size={20}
                      onPress={() => {
                        console.log("Share note", note.id);
                        setSelectedNoteId(note.id);
                        handlePresentModalPress();
                      }}
                    />
                  )
                }

                {
                  // Only show delete button if the user is the owner or creator of the note
                  (note.owner.id === myId || note.creator.id === myId) && (
                    <IconButton
                      icon="trash-can-outline"
                      color={Colors.red500}
                      size={20}
                      onPress={() => onDeleteNoteClick(note.id)}
                    />
                  )
                }
              </View>
            </>
          ),
          description: () => {
            return (
              <View>
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
                style={styles.timelineAvatarStyle}
              />
            </View>
          ),
        })),
      pageParams: result.pageParams,
    } as any;
  });

  const TimelineHeader = () => (
    <View style={styles.timelineHeadingContainer}>
      <Text style={styles.timelineHeadingTitleText}>
        Danh sách ghi chú về sinh viên
      </Text>
      <View style={styles.underline} />
    </View>
  );

  const LoadingComponent = () => (
    <View style={styles.centerContainer}>
      <Chase color={Color.primary} />
    </View>
  );

  const EmptyComponent = () => {
    if (isSuccess && data?.pages.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <NotiFailed width={20} height={20} />
          <Text style={styles.emptyText}>
            Không có ghi chú nào về sinh viên này
          </Text>
        </View>
      );
    }

    return null;
  };

  const onDeleteNoteClick = (noteId: string) => {
    const deleteNote = async () => {
      setIsLoading(true);
      mutateAsync({ noteId }).finally(() => {
        setIsLoading(false);
      });
    };
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa ghi chú này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => deleteNote(),
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const generalShareData = [
    {
      type: NoteShareType.PUBLIC,
      title: "Công khai",
      description: "Bất kì ai cũng có thể xem nhưng không có quyền được sửa",
      icon: "public",
      iconColor: "#333",
      color: "#333",
    },
    {
      type: NoteShareType.MENTOR_VIEW,
      title: "Mentor chỉ được xem",
      description: "Chỉ có Mentor chỉ được xem",
      icon: "visibility",
      iconColor: "#3357FF",
      color: "#3357FF",
    },
    {
      type: NoteShareType.MENTOR_EDIT,
      title: "Mentor được chỉnh sửa",
      description: "Chỉ có Mentor được xem và chỉnh sửa",
      icon: "edit",
      iconColor: "#32CD32",
      color: "#32CD32",
    },
    {
      type: NoteShareType.PRIVATE,
      title: "Không công khai",
      description: "Chỉ có người được chọn được xem hoặc sửa",
      icon: "lock",
      iconColor: "#FF9933",
      color: "#FF9933",
    },
  ];

  const { control, handleSubmit } = useForm<ShareNoteRequest>({
    defaultValues: {
      shareType: NoteShareType.PUBLIC,
      users: [
        {
          id: "1",
          name: "Nguyễn Văn 1",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.VIEW,
        },
        {
          id: "2",
          name: "Nguyễn Văn 2",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.VIEW,
        },
        {
          id: "3",
          name: "Nguyễn Văn 3",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.EDIT,
        },
        {
          id: "4",
          name: "Nguyễn Văn 4",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.VIEW,
        },
        {
          id: "5",
          name: "Nguyễn Văn 5",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.VIEW,
        },
        {
          id: "6",
          name: "Nguyễn Văn 6",
          imageUrl: "https://via.placeholder.com/150",
          email: "dqvinh20@clc.fitus",
          permission: NotePermission.VIEW,
        },
      ] as ViewNoteUserAccess[],
    },
  });
  const {
    fields: shareUsersInput,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "users",
  });

  const onDonePress = useCallback(
    submitData => {
      console.log(selectedNoteId, submitData);
      // shareNoteAsync({
      //   noteId: selectedNoteId,
      //   shareNoteRequest: {
      //     shareType: submitData.shareType,
      //     users: submitData.users.map(user => ({
      //       userId: user.id,
      //       permission: user.permission,
      //     })),
      //   },
      // });
      handleCloseModalPress();
    },
    [selectedNoteId],
  );

  // Bottom Sheet Modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const onRemoveShareUser = (itemIndex: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa người này khỏi danh sách?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          style: "destructive",
          onPress: () => {
            remove(itemIndex);
          },
        },
      ],
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    itemIndex: number,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity onPress={() => onRemoveShareUser(itemIndex)}>
        <Animated.View style={[styles.deleteButton, { opacity }]}>
          <Text style={styles.deleteButtonText}>Xoá</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <Swipeable
        renderRightActions={(progress, dragAnimatedValue) =>
          renderRightActions(progress, dragAnimatedValue, index)
        }
        overshootLeft={false}
        overshootRight={true}>
        <Card.Title
          title={item.name}
          style={styles.userCard}
          titleStyle={styles.userCardTitle}
          leftStyle={styles.userCardLeft}
          titleNumberOfLines={1}
          subtitle={item.email}
          subtitleNumberOfLines={1}
          left={props => {
            return (
              <Avatar.Image
                {...props}
                style={styles.userCardAvatar}
                source={() => (
                  <CacheImage
                    url={Helper.getImageUrl(item.imageUrl)}
                    defaultSource={DefaultUserAvatar}
                    style={styles.userCardAvatar}
                  />
                )}
              />
            );
          }}
          right={() => {
            return (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedUserIndex(index);
                  handlePresentSharePermissionModalPress();
                }}>
                <Text style={[styles.text, { color: item.color }]}>
                  {item.permission === NotePermission.VIEW
                    ? "Xem"
                    : "Chỉnh sửa"}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} />
              </TouchableOpacity>
            );
          }}
        />
      </Swipeable>
    ),
    [],
  );

  const generalShareDataMapper = useCallback((type: NoteShareType) => {
    switch (type) {
      case NoteShareType.PUBLIC:
        return generalShareData[0];
      case NoteShareType.MENTOR_VIEW:
        return generalShareData[1];
      case NoteShareType.MENTOR_EDIT:
        return generalShareData[2];
      case NoteShareType.PRIVATE:
        return generalShareData[3];
      default:
        return generalShareData[0];
    }
  }, []);

  const bottomSheetShareTypeModalRef = useRef<BottomSheetModal>(null);

  const handlePresentShareTypeModalPress = useCallback(() => {
    bottomSheetShareTypeModalRef.current?.present();
  }, []);

  const handleCloseShareTypeModalPress = useCallback(() => {
    bottomSheetShareTypeModalRef.current?.dismiss();
  }, []);

  const bottomSheetSharePermissionModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSharePermissionModalPress = useCallback(() => {
    bottomSheetSharePermissionModalRef.current?.present();
  }, []);

  const handleCloseSharePermissionModalPress = useCallback(() => {
    bottomSheetSharePermissionModalRef.current?.dismiss();
  }, []);

  return (
    <SafeAreaView
      style={[
        GlobalStyles.fullFlex,
        {
          backgroundColor: Color.backgroundGray,
        },
      ]}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }>
        <Timeline
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
        />
      </ScrollView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={["80%"]}
          backdropComponent={CustomBackdrop}
          enableOverDrag={true}
          style={styles.bottomSheetModal}>
          <BottomSheetTextInput
            style={styles.searchEmailInput}
            placeholder="Nhập email để chia sẻ"
            placeholderTextColor={"#fff"}
            onChangeText={setSearchEmailQuery}
          />

          <View style={GlobalStyles.fullFlex}>
            <Text style={[styles.sectionHeaderText, styles.marginRight]}>
              Người có quyền truy cập
            </Text>

            <BottomSheetVirtualizedList<ViewNoteUserAccess>
              data={shareUsersInput}
              keyExtractor={i => i.id}
              getItemCount={data1 => data1.length}
              getItem={(data1, index) => data1[index]}
              renderItem={renderItem}
            />
          </View>

          <View
            style={[
              GlobalStyles.fullFlex,
              {
                marginTop: 8,
              },
            ]}>
            <Text style={styles.sectionHeaderText}>Truy cập cơ bản</Text>
            <Controller
              name="shareType"
              control={control}
              render={({ field: { value } }) => {
                const item = generalShareDataMapper(value);
                return (
                  <TouchableOpacity>
                    <View style={styles.shareTypeContainer}>
                      <View style={styles.iconContainer}>
                        <MaterialIcons
                          name={item.icon}
                          size={24}
                          color={item.iconColor}
                        />
                      </View>

                      <View style={GlobalStyles.fullFlex}>
                        <View>
                          <TouchableOpacity
                            style={styles.shareTypeBtn}
                            onPress={() => handlePresentShareTypeModalPress()}>
                            <Text style={[styles.text, { color: item.color }]}>
                              {item.title}
                            </Text>
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={24}
                              color={item.color}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={styles.shareTypeDescription}
                          numberOfLines={2}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <Button
              mode="contained"
              onPress={() => handleSubmit(onDonePress)()}
              style={{
                backgroundColor: Color.primary,
              }}>
              <Text style={styles.text}>Xong</Text>
            </Button>
          </View>
        </BottomSheetModal>

        <Controller
          control={control}
          name="shareType"
          render={({ field: { onChange } }) => (
            <ShareTypeBottomSheet
              ref={bottomSheetShareTypeModalRef}
              index={0}
              snapPoints={["40%"]}
              backdropComponent={CustomBackdrop}
              enableOverDrag={true}
              stackBehavior="push"
              onShareTypeChange={(shareType: NoteShareType) => {
                onChange(shareType);
                handleCloseShareTypeModalPress();
              }}
            />
          )}
        />

        <SharePermissionBottomSheet
          ref={bottomSheetSharePermissionModalRef}
          index={0}
          snapPoints={["28%"]}
          backdropComponent={CustomBackdrop}
          enableOverDrag={true}
          stackBehavior="push"
          onSharePermissionChange={(permission: NotePermission) => {
            handleCloseSharePermissionModalPress();
            update(selectedUserIndex, {
              ...shareUsersInput[selectedUserIndex],
              permission,
            });
          }}
        />

        <AppErrorModal
          hasError={isError}
          error={error}
          onPress={reset}
          onRequestClose={reset}
        />
        <AppLoadingIndicator />
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shareTypeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 12,
    borderRadius: 8,
  },
  iconContainer: {
    backgroundColor: "rgb(220, 220, 220)",
    padding: 12,
    borderRadius: 999,
    marginRight: 12,
  },
  shareTypeBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgb(220, 220, 220)",
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: FontSize.normal,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  shareTypeDescription: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "400",
    marginHorizontal: 4,
    marginTop: 8,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  // Bottom Sheet
  bottomSheetModal: {
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },

  searchEmailInput: {
    alignSelf: "stretch",
    backgroundColor: Colors.grey500,
    borderRadius: 8,
    color: "white",
    marginBottom: 8,
    padding: 8,
    textAlign: "left",
  },

  userCard: {
    margin: 0,
    minHeight: 50,
    padding: 0,
  },
  userCardTitle: {
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
  userCardLeft: {
    marginRight: 12,
  },
  userCardAvatar: {
    borderRadius: 99,
    height: 40,
    width: 40,
  },

  sectionHeaderText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  timelineTimeContainerStyle: {
    flexBasis: "20%",
    margin: 0,
    padding: 0,
  },
  timelineContentContainerStyle: { flex: 1, paddingBottom: 36 },
  timelineAvatarStyle: {
    borderColor: "#fff",
    borderRadius: 25,
    borderWidth: 3,
    height: 45,
    width: 45,
  },
  timelineHeadingContainer: { paddingHorizontal: 12, paddingVertical: 0 },
  timelineHeadingTitleText: { color: "#222", fontSize: 20, fontWeight: "bold" },
  underline: {
    backgroundColor: "#6F98FA",
    height: 3,
    marginBottom: 12,
    marginLeft: 12,
    marginTop: 5,
    width: "30%",
  },

  deleteButton: {
    backgroundColor: "#b60000",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: "100%",
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
  },

  marginRight: {
    marginBottom: 12,
  },
});

export default UserNotes;
