import { DeviceEventEmitter, FlatList, View, Text } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScreenProps } from "~/types/navigation";
import { FaqModel, GROUP_FAQ_SAMPLE } from "~/models/faq";
import FaqApi from "~/api/remote/FaqApi";
import FAQItem from "~/components/FAQItem";
import styles from "./styles";
import { Button, FAB, Snackbar } from "react-native-paper";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { FloatingAction } from "react-native-floating-action";
import { Color } from "~/constants/Color";
import { FaqIcon, ImportFaqIcon } from "~/assets/svgs";
import { GROUP_SAMPLE, GroupModel } from "~/models/group";
import GroupService from "~/services/group";

const GroupFAQ: ScreenProps<"groupFAQ"> = ({ route }) => {
  const { groupId } = route.params;
  const navigation = useNavigation();

  /* State */
  const [faqs, setFaqs] = useState<FaqModel[]>([]);
  const [group, setGroup] = useState<GroupModel>(GROUP_SAMPLE);

  /* UI state */
  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // render item
  const renderItem = useCallback(
    ({ index, item }: { index: number; item: FaqModel }) => {
      return (
        <FAQItem
          onPress={() => {
            navigation.navigate("faqDetail", { faqId: item.id });
          }}
          faq={item}
        />
      );
    },
    [],
  );

  // Side effect: Call API
  const fetchData = async () => {
    try {
      // Call remote
      const data = await Promise.all([
        GroupService.findById(groupId),
        FaqApi.getGroupFaq(groupId),
      ]);

      // Set state
      setGroup(data[0]);
      setFaqs(data[1]);

      // Loading UI
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_GroupFAQ: ", error);
    }
  };

  // side effect
  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading, groupId]);

  const Actions = [
    {
      text: "Tạo câu hỏi mới",
      icon: <FaqIcon width={20} />,
      color: "white",
      name: "create",
      position: 1,
    },
    {
      text: "Chọn từ nhóm khác",
      icon: <ImportFaqIcon />,
      color: "white",
      name: "import",
      position: 2,
    },
  ];

  const onAdd = (name: string | undefined) => {
    if (!name) {
      return;
    }
    switch (name) {
      case "create":
        navigation.navigate("createFaq", { groupId: groupId });
        break;
      case "import":
        navigation.navigate("selectGroup", { groupId: groupId });
        break;
      default:
        break;
    }
  };

  const onDismissSnackBar = () => setSnackBar(false);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshFAQList,
      ({ status, message }: { status: boolean; message: string }) => {
        setTimeout(() => {
          setLoading(status);
          setMessage(message);
          setSnackBar(true);
        }, 500);
      },
    );

    return () => {
      return subcribe.remove();
    };
  }, []);

  const onImportFAQ = () => {
    navigation.navigate("selectGroup", { groupId: groupId });
  };

  const _ListEmptyComponent = () => {
    if (loading) {
      return <></>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nhóm chưa có FAQ nào</Text>

        {isMentor && (
          <View>
            <Button
              onPress={onImportFAQ}
              mode="contained"
              icon="playlist-plus"
              color={Color.primary}
              uppercase={true}>
              Chọn câu hỏi từ nhóm khác
            </Button>
          </View>
        )}
      </View>
    );
  };

  const isMentor = useMemo(() => {
    return group.role == "MENTOR";
  }, [group]);

  return (
    <View style={styles.container}>
      <FlatList
        data={faqs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        ItemSeparatorComponent={() => <SizedBox height={8} />}
        ListEmptyComponent={_ListEmptyComponent}
        refreshing={loading}
        onRefresh={() => setLoading(true)}
      />
      {isMentor && (
        <FloatingAction
          actions={Actions}
          onPressItem={name => {
            onAdd(name);
          }}
          color={Color.primary}
          tintColor={Color.transparent}
          animated={true}
        />
      )}
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1000}>
        {message}
      </Snackbar>
    </View>
  );
};

export default GroupFAQ;
