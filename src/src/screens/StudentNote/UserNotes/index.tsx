/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useContext, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Animated,
} from "react-native";
import { ScreenProps } from "~/types/navigation";
import { useGetAllNoteOfUserInfinityQuery } from "~/app/server/notes/queries";
import dayjs from "dayjs";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import { Color } from "~/constants/Color";
import { NotiFailed } from "~/assets/svgs";
import { Avatar, Card, IconButton } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { useDeleteNoteMutation } from "~/app/server/notes/mutation";
import { AppContext } from "~/context/app";
import AppLoadingIndicator from "~/components/AppLoadingIndicator";
import AppErrorModal from "~/components/AppErrorModal";
import { useCurrentUser } from "~/app/server/users/queries";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import GlobalStyles from "~/constants/GlobalStyles";
import { DefaultUserAvatar } from "~/assets/images";
import { HeaderIconRight } from "~/components/Header";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Note } from "~/models/note";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Skeleton } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";
import { screenWidth } from "~/constants";
import ShareNoteBottomSheet from "../ShareNoteBottomSheet";

const UserNotes: ScreenProps<"userNotes"> = ({ navigation, route }) => {
  const { setIsLoading } = useContext(AppContext);
  const { data: myId } = useCurrentUser(profile => profile.id);
  const { width } = useWindowDimensions();
  const { userId } = route.params;
  const [selectedNoteId, setSelectedNoteId] = React.useState<string>("");

  const { mutateAsync, isError, error, reset } = useDeleteNoteMutation(userId);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isLoading,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useGetAllNoteOfUserInfinityQuery(userId, result => {
    return {
      pages: result.pages.flatMap(page => page.data),
      pageParams: result.pageParams,
    } as any;
  });

  const SkeletonCard = () => (
    <Card style={{ width: "100%", marginHorizontal: 8, marginVertical: 4 }}>
      <Card.Title
        title={
          <Skeleton
            width={100}
            LinearGradientComponent={LinearGradient}
            animation="wave"
          />
        }
        titleStyle={styles.userCardTitle}
        leftStyle={styles.userCardLeft}
        subtitle={
          <Skeleton
            width={screenWidth * 0.5}
            LinearGradientComponent={LinearGradient}
            animation="wave"
          />
        }
        subtitleStyle={styles.userCardSubtitle}
        titleNumberOfLines={1}
        left={props => {
          return (
            <Skeleton
              LinearGradientComponent={LinearGradient}
              animation="wave"
              circle
              width={props.size}
              height={props.size}
            />
          );
        }}
      />
      <Card.Content>
        <View>
          <Skeleton
            width={"100%"}
            height={150}
            LinearGradientComponent={LinearGradient}
            animation="wave"
          />
        </View>
      </Card.Content>
    </Card>
  );

  const LoadingComponent = () => (
    <View
      style={{
        paddingHorizontal: 8,
        alignItems: "center",
      }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
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

  const onDeleteNoteClick = useCallback((noteId: string) => {
    const deleteNote = async () => {
      setIsLoading(true);
      mutateAsync(
        { noteId },
        {
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
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
  }, []);

  navigation.setOptions({
    headerRight: () => {
      return (
        <HeaderIconRight
          text="add"
          onPress={() => {
            navigation.navigate("createOrUpdateNote", { userIds: [userId] });
          }}
        />
      );
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderRightNoteActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    noteId: string,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View
        style={{
          marginVertical: 5,
          marginRight: 5,
        }}>
        <TouchableOpacity onPress={() => onDeleteNoteClick(noteId)}>
          <Animated.View style={[styles.deleteButton, { opacity }]}>
            <Text style={styles.deleteButtonText}>Xoá</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNoteItem: ListRenderItem<Note> = ({ item }) => {
    return (
      <Swipeable
        key={item.id}
        dragOffsetFromRightEdge={
          item.owner.id === myId || item.creator.id === myId
            ? 10
            : Number.MAX_VALUE
        }
        renderRightActions={(progress, dragAnimatedValue) =>
          renderRightNoteActions(progress, dragAnimatedValue, item.id)
        }
        overshootLeft={false}
        overshootRight={true}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate("noteDetail", { noteId: item.id })
          }>
          <Card
            style={styles.noteCard}
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => {
              e.stopPropagation();
            }}>
            <Card.Title
              title={item.title}
              titleStyle={styles.userCardTitle}
              leftStyle={styles.userCardLeft}
              subtitle={
                "Ngày tạo: " + dayjs(item.createdDate).format("DD/MM/YYYY")
              }
              subtitleStyle={styles.userCardSubtitle}
              titleNumberOfLines={1}
              left={props => {
                return (
                  <Avatar.Image
                    {...props}
                    style={styles.userCardAvatar}
                    source={() => (
                      <CacheImage
                        url={Helper.getImageUrl(item.creator.imageUrl)}
                        defaultSource={DefaultUserAvatar}
                        style={styles.userCardAvatar}
                      />
                    )}
                  />
                );
              }}
              right={() => {
                const isVisibledOptions =
                  item.isEditable ||
                  item.owner.id === myId ||
                  item.creator.id === myId;
                return (
                  <View
                    style={
                      isVisibledOptions
                        ? {
                            display: "flex",
                            flexDirection: "row",
                          }
                        : {
                            display: "none",
                          }
                    }>
                    {item.isEditable && (
                      <TouchableOpacity
                        onPress={() => {
                          handleCloseModalPress();
                          navigation.navigate("createOrUpdateNote", {
                            noteId: item.id,
                          });
                        }}>
                        <IconButton
                          icon="note-edit-outline"
                          color={Color.primary}
                          style={{
                            marginRight:
                              item.owner.id === myId || item.creator.id === myId
                                ? 0
                                : 16,
                          }}
                          size={20}
                        />
                      </TouchableOpacity>
                    )}

                    {
                      // Only show share button if the user is the owner of the note
                      item.owner.id === myId && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedNoteId(item.id);
                            handlePresentModalPress();
                          }}>
                          <IconButton
                            icon="share-variant-outline"
                            color={Color.primary}
                            style={{ marginRight: 16 }}
                            size={20}
                          />
                        </TouchableOpacity>
                      )
                    }
                  </View>
                );
              }}
            />
            <Card.Content>
              <View>
                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: item.content,
                  }}
                  baseStyle={{
                    fontSize: 16,
                  }}
                />
              </View>
            </Card.Content>
          </Card>
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView
      style={[
        GlobalStyles.fullFlex,
        {
          backgroundColor: Color.backgroundGray,
          paddingBottom: 12,
        },
      ]}>
      <FlashList<Note>
        data={(data?.pages as Note[]) || []}
        renderItem={renderNoteItem}
        estimatedItemSize={200}
        ListEmptyComponent={EmptyComponent}
        ListFooterComponent={
          isLoading || isFetchingNextPage ? (
            <LoadingComponent />
          ) : (
            <EmptyComponent />
          )
        }
        keyExtractor={item => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReachedThreshold={0.8}
        onEndReached={hasNextPage ? fetchNextPage : undefined}
      />
      <BottomSheetModalProvider>
        <ShareNoteBottomSheet
          ref={bottomSheetModalRef}
          userId={userId}
          selectedNoteId={selectedNoteId}
        />
      </BottomSheetModalProvider>
      <AppErrorModal
        hasError={isError}
        error={error}
        onPress={reset}
        onRequestClose={reset}
      />
      <AppLoadingIndicator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  noteCard: {
    backgroundColor: "white",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  userCardAvatar: {
    borderRadius: 99,
    height: 42,
    width: 42,
  },
  userCardLeft: {
    marginRight: 16,
  },
  userCardSubtitle: {
    fontSize: 12,
    margin: 0,
    padding: 0,
  },

  userCardTitle: {
    fontSize: 16,
    margin: 0,
    padding: 0,
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
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserNotes;
