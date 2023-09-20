import {
  DeviceEventEmitter,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import ListHeader from "./ListHeader";
import styles from "./styles";
import GroupItem from "~/components/GroupItem";
import GlobalStyles from "~/constants/GlobalStyles";
import HomeServices from "~/services/home";
import {useNavigation} from "@react-navigation/native";
import {GroupModel} from "~/models/group";
import {Line} from "~/components/Separator";
import EventEmitterNames from "~/constants/EventEmitterNames";
import {useQueryGroupList, useUpdateQueryGroupList} from "../queries";
import ListGroupSkeleton from "../ListGroupSkeleton";
import {MeetingModel} from "~/models/meeting";
import {TaskModel} from "~/models/task";
import {Text} from "react-native";
import {Button} from "react-native-paper";
import {Color} from "~/constants/Color";
import {RefreshIcon} from "~/assets/svgs";
import ListFooter from "./ListFooter";
import {useAppDispatch} from "~/redux";
import UserThunks from "~/redux/features/user/thunk";

const General = () => {
  const navigation = useNavigation();
  const dispatcher = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<(MeetingModel | TaskModel)[]>([]);

  const data = useQueryGroupList();
  const queryAction = useUpdateQueryGroupList();

  const renderItem = useCallback(({item}: {item: GroupModel}) => {
    const onPress = () => {
      queryAction.seenNewMessage(item.id);
      navigation.navigate("workspace", {groupId: item.id});
    };
    return (
      <View style={[styles.itemCtn]}>
        <GroupItem onPress={onPress} group={item} />
      </View>
    );
  }, []);

  const renderListHeader = () => {
    if (events.length == 0) {
      return <></>;
    }
    return <ListHeader events={events} />;
  };

  const fetchHomePageData = async () => {
    const events = await HomeServices.getIncommingEvents();
    setEvents(events);
    setLoading(false);
  };

  const onEndReached = () => {
    if (data.hasNextPage) {
      data.fetchNextPage();
    }
  };

  const onRefresh = () => {
    data.refetch();
    fetchHomePageData();
    dispatcher(UserThunks.getCurrentUser());
  };

  useEffect(() => {
    if (loading) {
      data.refetch();
      fetchHomePageData();
    }
  }, [loading]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshHomePage,
      () => {
        setLoading(true);
      },
    );

    dispatcher(UserThunks.getCurrentUser());

    return () => {
      subcribe.remove();
    };
  }, []);

  if (data.isFetching && !data.data) {
    return <ListGroupSkeleton />;
  }

  const renderListFooterComponent = () => {
    if (!data.data || data.data.pages.flat().length == 0) {
      return <ListFooter onRefresh={onRefresh} loading={loading} />;
    }
    return <></>;
  };

  return (
    <SafeAreaView style={GlobalStyles.fullFlex}>
      <FlatList
        data={!data.data ? [] : data.data.pages.flat()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooterComponent}
        style={styles.container}
        keyExtractor={item => `recent-group-${item.id}`}
        ItemSeparatorComponent={() => {
          return <Line />;
        }}
        refreshing={data.isFetching}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </SafeAreaView>
  );
};

export default General;
