import { SafeAreaView, FlatList } from "react-native";
import styles from "./styles";
import React, { useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { useNotificationsQuery } from "../queries";

const NotificationList = () => {
  const data = useNotificationsQuery();

  const renderNotificationItem = ({ item, index }) => {
    return <NotificationItem notification={item} index={index} key={item.id} />;
  };

  const refresh = () => {
    data.refetch();
  };

  const endReached = () => {
    if (data.hasNextPage) {
      data.fetchNextPage();
    }
  };

  useEffect(() => {
    data.refetch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={!data.data ? [] : data.data.pages.flat()}
        keyExtractor={item => String(item.id)}
        renderItem={renderNotificationItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => null}
        refreshing={data.isFetching}
        onEndReachedThreshold={0.5}
        onRefresh={refresh}
        onEndReached={endReached}
      />
    </SafeAreaView>
  );
};

export default NotificationList;
