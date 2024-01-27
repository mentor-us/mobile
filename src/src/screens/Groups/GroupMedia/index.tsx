import { View, useWindowDimensions, Text } from "react-native";
import { ScreenProps } from "~/types/navigation";
import styles from "./styles";
import { useState } from "react";
import CustomTabView from "./CustomTabView";
import { SceneMap, TabView } from "react-native-tab-view";
import CustomTabBar from "./CustomTabBar";
import { useGetGroupMedia } from "~/app/server/groups/queries";
import GlobalStyles from "~/constants/GlobalStyles";

const GroupMedia: ScreenProps<"groupMedia"> = ({ route }) => {
  // State
  const { groupId, mode } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "images", title: "Hình ảnh" },
    { key: "files", title: "Tập tin" },
  ]);
  const layout = useWindowDimensions();
  const {
    data: groupMedia,
    isLoading,
    isRefetching,
    isSuccess,
    isError,
    refetch,
  } = useGetGroupMedia(groupId);

  if (isError) {
    return (
      <View style={styles.error}>
        <Text style={GlobalStyles.errorText}>
          Có lỗi xảy ra. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  // Multiple tab view
  const FirstRoute = () => (
    <CustomTabView
      data={groupMedia?.images ?? []}
      loading={isLoading || isRefetching}
      mode={"IMAGE"}
      refresh={refetch}
    />
  );

  const SecondRoute = () => (
    <CustomTabView
      data={groupMedia?.files ?? []}
      loading={isLoading || isRefetching}
      mode={"FILE"}
      refresh={refetch}
    />
  );

  const _renderScene = () =>
    SceneMap({
      images: FirstRoute,
      files: SecondRoute,
    });

  return (
    <View style={styles.container}>
      {isSuccess && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={_renderScene()}
          renderTabBar={CustomTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      )}
    </View>
  );
};

export default GroupMedia;
