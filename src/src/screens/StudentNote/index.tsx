import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import styles from "./styles";
import { FAB, SearchBar } from "@rneui/themed";
import { Color } from "~/constants/Color";
import { RouteProp } from "@react-navigation/native";
import { NoteUserProfile } from "~/models/note";
import { BorderlessButton } from "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";
import { MentorUsRoutes } from "~/types/navigation";
import { useGetNotedUsersInfinityQuery } from "~/app/server/notes/queries";
import { DefaultUserAvatar } from "~/assets/images";
import { Skeleton } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";
import { screenWidth } from "~/constants";
import { useEffect, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function StudentNote({
  navigation,
  route,
}: {
  navigation: any;
  route: RouteProp<MentorUsRoutes.StudentNoteStack, "studentNote">;
}) {
  const { searchOn, searchQuery } = route.params;
  const searchBarRef = useRef<any>();
  const onChangeSearch = query => navigation.setParams({ searchQuery: query });
  const {
    data: notedUsersList,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useGetNotedUsersInfinityQuery(searchQuery);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: !searchOn
        ? "Danh sách sinh viên"
        : () => (
            <SearchBar
              ref={searchBarRef}
              showLoading={isLoading}
              loadingProps={{
                color: Color.white,
              }}
              containerStyle={styles.searchBarContainerStyle}
              inputContainerStyle={styles.searchBarInputContainerStyle}
              inputStyle={styles.searchBarInputStyle}
              leftIconContainerStyle={styles.searchBarLeftIconContainerStyle}
              searchIcon={{
                Component: MaterialIcons,
                iconProps: {
                  name: "search",
                  color: Color.white,
                },
              }}
              cancelIcon={{
                Component: MaterialIcons,
                iconProps: {
                  name: "arrow-back",
                  color: Color.white,
                },
              }}
              placeholderTextColor={Color.white}
              onCancel={() =>
                navigation.setParams({ searchOn: false, searchQuery: "" })
              }
              onClear={() => navigation.setParams({ searchQuery: "" })}
              clearIcon={{
                Component: MaterialIcons,
                iconProps: {
                  name: "close",
                  color: Color.white,
                },
              }}
              platform={"android"}
              placeholder="Tìm bằng tên hoặc email"
              style={{
                color: Color.white,
              }}
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
          ),
      headerLeft: null,
      headerRight: () =>
        searchOn ? null : (
          <BorderlessButton
            onPress={() => {
              navigation.setParams({ searchOn: true });
            }}
            style={{ marginRight: 15 }}>
            <Fontisto name="search" size={24} color={Color.white} />
          </BorderlessButton>
        ),
    });
  }, [navigation, route, isLoading]);

  useEffect(() => {
    setTimeout(() => {
      console.log("focus", searchBarRef?.current);
      if (searchOn && searchBarRef?.current) {
        searchBarRef?.current?.focus();
      }
    }, 500);
  }, [searchOn, searchBarRef]);

  const onUserPress = (userId: string, userName: string) => {
    navigation.navigate("userNotes", {
      userId,
      userName,
    });
  };

  const getDescriptions = (totalNotes: number) => {
    if (totalNotes.toString().length > 2) {
      return `Có 99+ ghi chú về người này`;
    }
    return `Có ${totalNotes} ghi chú về người này`;
  };

  const renderItem = ({ item }: ListRenderItemInfo<NoteUserProfile>) => {
    return (
      <TouchableOpacity onPress={() => onUserPress(item.id, item.name)}>
        <Card.Title
          style={styles.userCard}
          title={item.name}
          titleNumberOfLines={1}
          subtitle={getDescriptions(item.totalNotes)}
          subtitleNumberOfLines={1}
          left={props => {
            return (
              <Avatar.Image
                style={styles.userCardIcon}
                {...props}
                source={() => (
                  <CacheImage
                    url={Helper.getImageUrl(item.imageUrl)}
                    defaultSource={DefaultUserAvatar}
                    style={[
                      {
                        width: props.size,
                        height: props.size,
                        borderRadius: props.size,
                      },
                      styles.itemAvatar,
                    ]}
                  />
                )}
              />
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (searchQuery === "" && notedUsersList?.pages?.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.empty}>
            <View style={styles.fake}>
              <View style={styles.fakeCircle} />
              <View>
                <View style={[styles.fakeLine, { width: 120 }]} />
                <View style={styles.fakeLine} />
                <View
                  style={[styles.fakeLine, { width: 70, marginBottom: 0 }]}
                />
              </View>
            </View>
            <View style={[styles.fake, { opacity: 0.5 }]}>
              <View style={styles.fakeCircle} />
              <View>
                <View style={[styles.fakeLine, { width: 120 }]} />
                <View style={styles.fakeLine} />
                <View
                  style={[styles.fakeLine, { width: 70, marginBottom: 0 }]}
                />
              </View>
            </View>
            <Text style={styles.emptyTitle}>
              Bạn chưa có ghi chú cho sinh viên nào
            </Text>
            <Text style={styles.emptyDescription}>
              Khi bạn ghi chú cho sinh viên, chúng sẽ xuất hiện ở đây
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả phù hợp</Text>
        </View>
      </View>
    );
  };

  const SkeletonCard = () => (
    <Card.Title
      style={styles.userCard}
      title={
        <Skeleton
          width={100}
          LinearGradientComponent={LinearGradient}
          animation="wave"
        />
      }
      titleNumberOfLines={1}
      subtitle={
        <Skeleton
          width={screenWidth * 0.6}
          LinearGradientComponent={LinearGradient}
          animation="wave"
        />
      }
      subtitleNumberOfLines={1}
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
  );

  const LoadingComponent = () => (
    <View style={styles.centerView}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList<NoteUserProfile>
        data={notedUsersList?.pages || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={isLoading ? LoadingComponent : renderEmpty}
        onEndReached={hasNextPage ? fetchNextPage : undefined}
      />

      <FAB
        style={styles.fab}
        icon={{ name: "add", color: "white" }}
        onPress={() => navigation.navigate("createOrUpdateNote", {})}
        color={Color.primary}
      />
    </SafeAreaView>
  );
}

export default StudentNote;
