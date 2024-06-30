import {
  BottomSheetModal,
  BottomSheetVirtualizedList,
} from "@gorhom/bottom-sheet";
import React, {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { View, Text, Alert, Animated } from "react-native";
import {
  NotePermission,
  NoteShareType,
  NoteUserAccessRequest,
  ShareNoteRequest,
} from "~/models/note";
import CustomBackdrop from "../CustomBottomSheet/CustomBackdrop";
import { MultiSelect } from "react-native-element-dropdown";
import { UserProfileModel } from "~/models/user";
import GlobalStyles from "~/constants/GlobalStyles";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  useCurrentUser,
  useSearchAllUsersByEmail,
} from "~/app/server/users/queries";
import ShareTypeBottomSheet from "../ShareTypeBottomSheet";
import SharePermissionBottomSheet from "../SharePermissionBottomSheet";
import { Avatar, Button, Card, Colors } from "react-native-paper";
import { Color } from "~/constants/Color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontSize from "~/constants/FontSize";
import { StyleSheet } from "react-native";
import { DefaultUserAvatar } from "~/assets/images";
import Helper, { fromValueToString, fromValuetoNumber } from "~/utils/Helper";
import CacheImage from "~/components/CacheImage";
import { useGetNoteDetailQuery } from "~/app/server/notes/queries";
import { useShareNoteMutation } from "~/app/server/notes/mutation";

interface ShareNoteBottomSheetProps {
  selectedNoteId: string;
  userId: string;
}

interface ViewNoteUserAccess {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  accessType: NotePermission;
}

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

function ShareNoteBottomSheet(
  { selectedNoteId, userId }: ShareNoteBottomSheetProps,
  ref: Ref<BottomSheetModal>,
) {
  const { mutateAsync: shareNoteAsync, isLoading } =
    useShareNoteMutation(userId);
  const { data: myInfo } = useCurrentUser();
  const { data: noteDetail } = useGetNoteDetailQuery(selectedNoteId, note => ({
    shareType: fromValuetoNumber(NoteShareType, note.shareType),
    users: note.userAccesses.map(
      noteShareUser =>
        ({
          id: noteShareUser.user.id,
          name: noteShareUser.user.name,
          imageUrl: noteShareUser.user.imageUrl,
          email: noteShareUser.user.email,
          accessType: fromValuetoNumber(
            NotePermission,
            noteShareUser.notePermission,
          ),
        } as unknown as ViewNoteUserAccess),
    ),
    creatorId: note.creator.id,
    ownerId: note.owner.id,
  }));
  const { data: usersResult } = useSearchAllUsersByEmail(users =>
    users.filter(
      user =>
        user.id !== myInfo?.id &&
        user.id !== noteDetail?.creatorId &&
        user.id !== noteDetail?.ownerId,
    ),
  );

  // Bottom Sheet Modal - Share Note
  const { control, handleSubmit, watch, setValue } = useForm<{
    shareType: NoteShareType;
    users: ViewNoteUserAccess[];
  }>({
    defaultValues: {
      shareType: NoteShareType.PRIVATE,
      users: [],
    },
    values: {
      shareType: noteDetail ? noteDetail.shareType : NoteShareType.PRIVATE,
      users: noteDetail ? noteDetail.users : [],
    },
  });

  const sharedNoteUsersIds = watch("users")?.flatMap(user => user.id) ?? [];
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);
  const { fields: shareUsersInput, remove } = useFieldArray({
    control,
    name: "users",
  });

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

  const onDonePress = submitData => {
    shareNoteAsync(
      {
        noteId: selectedNoteId,
        shareNoteRequest: {
          shareType: fromValueToString(NoteShareType, submitData.shareType),
          users: submitData.users.map(user => ({
            userId: user.id,
            accessType: fromValueToString(NotePermission, user.accessType),
          })),
        },
      },
      {
        onSettled: () => {
          ref?.current?.dismiss();
        },
      },
    );
  };

  const onRemoveShareUser = useCallback((itemIndex: number) => {
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
  }, []);

  const renderRightActions = useCallback(
    (
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
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <Swipeable
        key={item.id}
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
                  {item.accessType === NotePermission.VIEW
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

  // Bottom Sheet Ref
  const bottomSheetShareTypeModalRef = useRef<BottomSheetModal>(null);

  const handlePresentShareTypeModalPress = useCallback(() => {
    bottomSheetShareTypeModalRef.current?.present();
  }, []);

  const handleCloseShareTypeModalPress = useCallback(() => {
    bottomSheetShareTypeModalRef.current?.dismiss();
  }, []);

  const bottomSheetSharePermissionModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSharePermissionModalPress = useCallback(() => {
    handleCloseShareTypeModalPress();
    bottomSheetSharePermissionModalRef.current?.present();
  }, []);

  const handleCloseSharePermissionModalPress = useCallback(() => {
    bottomSheetSharePermissionModalRef.current?.dismiss();
  }, []);

  const onMainBottomSheetChange = useCallback(index => {
    if (index === -1) {
      handleCloseShareTypeModalPress();
      handleCloseSharePermissionModalPress();
    }
  }, []);

  const renderSelectItem = useCallback(
    item => {
      return (
        <View
          style={[
            styles.item,
            {
              backgroundColor: sharedNoteUsersIds.includes(item.id)
                ? Colors.grey400
                : Colors.white,
            },
          ]}>
          <CacheImage
            url={Helper.getImageUrl(item.imageUrl)}
            defaultSource={DefaultUserAvatar}
            style={[
              styles.userCardAvatar,
              {
                marginRight: 12,
                padding: 0,
                borderRadius: 99,
                height: 32,
                width: 32,
              },
            ]}
          />
          <Text style={styles.textItem}>{item.name}</Text>
          {sharedNoteUsersIds.includes(item.id) && (
            <MaterialCommunityIcons
              name="check"
              size={24}
              color={Color.primary}
            />
          )}
        </View>
      );
    },
    [sharedNoteUsersIds],
  );

  return (
    <>
      <BottomSheetModal
        ref={ref}
        index={0}
        onChange={onMainBottomSheetChange}
        snapPoints={
          shareUsersInput.length === 0
            ? ["50%"]
            : shareUsersInput.length > 3
            ? ["80%"]
            : ["60%"]
        }
        backdropComponent={CustomBackdrop}
        enableOverDrag={true}
        style={styles.bottomSheetModal}>
        <MultiSelect<UserProfileModel>
          data={(usersResult as UserProfileModel[]) ?? []}
          labelField={"name"}
          valueField={"id"}
          onFocus={() => {
            handleCloseSharePermissionModalPress();
            handleCloseShareTypeModalPress();
          }}
          onChange={items => {
            setValue(
              "users",
              usersResult
                ?.filter(user => items.includes(user.id))
                .map(
                  user =>
                    ({
                      id: user.id,
                      name: user.name,
                      imageUrl: user.imageUrl,
                      email: user.email,
                      accessType: NotePermission.VIEW,
                    } as ViewNoteUserAccess),
                ) ?? [],
            );
          }}
          placeholder={
            sharedNoteUsersIds.length === 0
              ? "Chọn người cần chia sẻ"
              : `Đã chia sẻ ${sharedNoteUsersIds.length} người`
          }
          search
          searchPlaceholder="Tìm theo tên..."
          value={sharedNoteUsersIds}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          activeColor={Colors.grey300}
          visibleSelectedItem={false}
          alwaysRenderSelectedItem={false}
          renderItem={renderSelectItem}
        />

        <View style={GlobalStyles.fullFlex}>
          <Text style={[styles.sectionHeaderText, styles.marginRight]}>
            Người có quyền truy cập
          </Text>

          <BottomSheetVirtualizedList<ViewNoteUserAccess>
            data={watch("users")}
            keyExtractor={i => i.id}
            getItemCount={data1 => data1.length}
            getItem={(data1, index) => data1[index]}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Chưa có người nào được chia sẻ
              </Text>
            }
          />
        </View>

        <View
          style={{
            marginBottom: 16,
          }}>
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
            loading={isLoading}
            mode="contained"
            onPress={() => handleSubmit(onDonePress)()}
            style={{
              backgroundColor: Color.primary,
            }}>
            <Text style={styles.text}>Xác nhận</Text>
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
            snapPoints={["34%"]}
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
        snapPoints={["22%"]}
        backdropComponent={CustomBackdrop}
        enableOverDrag={true}
        stackBehavior="push"
        onSharePermissionChange={(permission: NotePermission) => {
          setValue(`users.${selectedUserIndex}.accessType`, permission);
          handleCloseSharePermissionModalPress();
        }}
      />
    </>
  );
}

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
  userCardSubtitle: {
    fontSize: 12,
    margin: 0,
    padding: 0,
  },
  userCardLeft: {
    marginRight: 16,
  },
  userCardAvatar: {
    borderRadius: 99,
    height: 42,
    width: 42,
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
    fontSize: 16,
  },

  marginRight: {
    marginBottom: 12,
  },

  dropdown: {
    height: 50,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default forwardRef<BottomSheetModal, ShareNoteBottomSheetProps>(
  ShareNoteBottomSheet,
);
