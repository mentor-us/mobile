import {TabBar} from "react-native-tab-view";
import styles from "./styles";
import {View, Text} from "react-native";
import {Color} from "~/constants/Color";

const CustomTabBar = props => {
  return (
    <TabBar
      {...props}
      renderLabel={({focused, route}) => (
        <View style={[styles.tabItem, {borderBottomWidth: focused ? 3 : 0}]}>
          <Text
            style={[
              styles.tabTitle,
              {color: focused ? Color.primary : Color.text[5]},
            ]}>
            {route.title}
          </Text>
        </View>
      )}
      tabStyle={styles.tabBar}
      indicatorContainerStyle={styles.indicatorContainerStyle}
      indicatorStyle={styles.indicatorStyle}
    />
  );
};

export default CustomTabBar;
