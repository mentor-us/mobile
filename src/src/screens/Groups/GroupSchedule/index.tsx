import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Text,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { ScreenProps } from "~/types/navigation";
import CustomTabView from "./CustomTabView";
import CustomTabBar from "./CustomTabBar";
import styles from "./styles";
import { FAB, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MeetingServices from "~/services/meeting";

import { SchedulesList } from "~/models/commonTypes";
import TaskServices from "~/services/task";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { UserNameIcon, QuickTaskIcon } from "~/assets/svgs";
import {
  FilterModel,
  FilterType,
  INIT_FILTER_MODELS,
} from "./FilterBar/FilterModel";
import FilterBar from "./FilterBar";

const GroupSchedule: ScreenProps<"groupSchedule"> = ({ route }) => {
  // state
  const { groupId, mode, role } = route.params;
  const showFilter = mode == "task";

  const [schedules, setSchedules] = useState<SchedulesList>({
    upcoming: [],
    passed: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [filter, setFilter] = useState<FilterType>("NONE");
  const [filters] = useState<FilterModel[]>(INIT_FILTER_MODELS);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const [routes] = useState([
    { key: "upcoming", title: "Sắp tới" },
    { key: "past", title: "Đã qua" },
  ]);

  // function
  const onAdd = () => {
    switch (mode) {
      case "meeting":
        navigation.navigate("createMeeting", {
          groupId: groupId,
        });
        return;
      case "task":
        navigation.navigate("createTask", { groupId });
        return;
      default:
        return;
    }
  };

  const onDismissSnackBar = () => setSnackBar(false);

  // api function
  const fetchTask = async (groupId: string) => {
    try {
      let data: SchedulesList;
      console.log("filter", filter);
      switch (filter) {
        case "OWN_TASK":
          data = await TaskServices.getOwnGroupTask(groupId);
          break;
        case "MY_ASSIGNED_TASK":
          data = await TaskServices.getOwnAssignedTask(groupId);
          break;
        case "ASSIGNED_BY_ME":
          data = await TaskServices.getOwnAssignedByMeTask(groupId);
          break;
        default:
          data = await TaskServices.getGroupTask(groupId);
      }
      console.log("data", data);
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMeeting = async (groupId: string) => {
    try {
      const data = await MeetingServices.getGroupMeeting(groupId);
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const choseFilter = (newFilter: FilterType) => {
    setLoading(true);

    if (newFilter == filter) {
      setFilter("NONE");
    } else {
      setFilter(newFilter);
    }
  };

  // render function
  const FirstRoute = () => (
    <CustomTabView
      schedules={schedules.upcoming}
      mode={mode}
      role={role}
      loading={loading}
      refresh={() => setLoading(true)}
      onAdd={onAdd}
      type={"UPCOMING"}
    />
  );

  const SecondRoute = () => (
    <CustomTabView
      schedules={schedules.passed}
      mode={mode}
      role={role}
      loading={loading}
      refresh={() => setLoading(true)}
      onAdd={onAdd}
      type={"PASSED"}
    />
  );

  const _renderScene = SceneMap({
    upcoming: FirstRoute,
    past: SecondRoute,
  });

  // side effect
  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshScheduleList,
      ({ status, message }: { status: boolean; message: string }) => {
        setTimeout(() => {
          setLoading(status);
          setMessage(message);
          setSnackBar(true);
        }, 1000);
      },
    );

    return () => {
      return subcribe.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: mode === "meeting" ? "Danh sách lịch hẹn" : "Danh sách công việc",
    });
    if (loading) {
      mode === "meeting" ? fetchMeeting(groupId) : fetchTask(groupId);
    }
  }, [loading, filter]);

  return (
    <View style={styles.container}>
      {showFilter && (
        <FilterBar
          filters={filters}
          currentFilter={filter}
          choseFilter={choseFilter}
        />
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={_renderScene}
        renderTabBar={CustomTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      <FAB icon={"plus"} style={styles.floatingButtonImage} onPress={onAdd} />
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1000}>
        {message}
      </Snackbar>
    </View>
  );
};

export default GroupSchedule;
