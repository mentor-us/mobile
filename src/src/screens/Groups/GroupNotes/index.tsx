import React, { useState } from "react";
import { useWindowDimensions, _Text, SafeAreaView } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { ScreenProps } from "~/types/navigation";
import CustomTabView from "./CustomTabView";
import CustomTabBar from "./CustomTabBar";
import styles from "./styles";
import { RoutesData, TabType } from "./index.props";

const GroupNotes: ScreenProps<"groupNote"> = ({ route }) => {
  /* Data in need */
  const groupId = route.params.groupId;
  const layout = useWindowDimensions();

  /* State */
  const [index, setIndex] = useState(0);

  const renderTabView = (type: TabType) => (
    <CustomTabView groupId={groupId} type={type} />
  );

  const renderScene = SceneMap({
    voting: () => renderTabView("voting"),
    pin: () => renderTabView("pin"),
    note: () => renderTabView("note"),
  });

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes: RoutesData }}
        renderScene={renderScene}
        renderTabBar={CustomTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

export default GroupNotes;
