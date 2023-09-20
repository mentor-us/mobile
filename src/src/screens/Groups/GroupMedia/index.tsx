import {View, useWindowDimensions} from "react-native";
import {ScreenProps} from "~/types/navigation";
import styles from "./styles";
import {useEffect, useState} from "react";
import {ShortMediaList} from "~/models/media";
import GroupService from "~/services/group";
import CustomTabView from "./CustomTabView";
import {SceneMap, TabView} from "react-native-tab-view";
import CustomTabBar from "./CustomTabBar";

const GroupMedia: ScreenProps<"groupMedia"> = ({route}) => {
  // State
  const {groupId, mode} = route.params;
  const [medias, setMedias] = useState<ShortMediaList>({
    images: [],
    files: [],
  } as ShortMediaList);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: "images", title: "Hình ảnh"},
    {key: "files", title: "Tập tin"},
  ]);
  const layout = useWindowDimensions();

  // Call API fetch Group Media
  const fetchMediaList = async () => {
    try {
      let data: ShortMediaList | null = await GroupService.getGroupMedia(
        groupId,
      );
      if (data == null) {
        setLoading(false);
        return;
      }
      setMedias(data);
      setLoading(false);
    } catch (error) {
      console.log("GroupMedia_error_fetchMediaList", error);
    }
  };

  // Call at once
  useEffect(() => {
    if (loading) {
      fetchMediaList();
    }
  }, [loading]);

  // Multiple tab view
  const FirstRoute = () => (
    <CustomTabView
      data={medias.images}
      loading={loading}
      mode={"IMAGE"}
      refresh={() => setLoading(true)}
    />
  );
  const SecondRoute = () => (
    <CustomTabView
      data={medias.files}
      loading={loading}
      mode={"FILE"}
      refresh={() => setLoading(true)}
    />
  );
  const _renderScene = SceneMap({
    images: FirstRoute,
    files: SecondRoute,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={_renderScene}
        renderTabBar={CustomTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

export default GroupMedia;
