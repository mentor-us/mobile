import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Dimensions } from "react-native";

import { ScreenProps } from "~/types/navigation";
import { useGetAllNoteOfUserInfinityQuery } from "~/app/server/notes/queries";
import { Timeline } from "react-native-just-timeline";
import dayjs from "dayjs";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import { Color } from "~/constants/Color";
import { Chase } from "react-native-animated-spinkit";
import { NotiFailed } from "~/assets/svgs";

const UserNotes: ScreenProps<"userNotes"> = ({ navigation, route }) => {
  const { userId } = route.params;
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isLoading,
    isFetchingNextPage,
  } = useGetAllNoteOfUserInfinityQuery(userId, result => {
    return {
      pages: result.pages
        .flatMap(page => page.data)
        .map(note => ({
          pressAction: () =>
            navigation.navigate("noteDetail", { noteId: note.id }),
          title: {
            content: note.title,
            style: {
              color: "#333",
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          description: {
            content: note.content,
            style: {
              color: "#333",
              fontSize: 13,
            },
          },
          time: {
            content: dayjs(note.createdDate).format("DD/MM/YYYY"),
            style: {
              paddingTop: 8,
              color: "#666",
              fontSize: 14,
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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Timeline
          data={data?.pages || []}
          lineStyle={{ backgroundColor: Color.primary }}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.backgroundGray,
    height: Dimensions.get("window").height,
    paddingHorizontal: 13,
    paddingTop: 12,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
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
});

export default UserNotes;
