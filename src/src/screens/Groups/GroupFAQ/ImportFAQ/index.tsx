import {DeviceEventEmitter, FlatList, View, Text} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {ScreenProps} from "~/types/navigation";
import {
  FaqImportList,
  FaqModel,
  FAQ_IMPORT_LIST_SAMPLE,
  GROUP_FAQ_SAMPLE,
} from "~/models/faq";
import FaqApi from "~/api/remote/FaqApi";
import FAQItem from "~/components/FAQItem";
import styles from "./styles";
import {Button, Checkbox, FAB, Snackbar} from "react-native-paper";
import SizedBox from "~/components/SizedBox";
import {useNavigation} from "@react-navigation/native";
import {Color} from "~/constants/Color";
import {CheckBoxType} from "~/models/commonTypes";
import {HeaderSubmitButton} from "~/components/Header";
import {StackNavigationOptions} from "@react-navigation/stack";
import EventEmitterNames from "~/constants/EventEmitterNames";
import FaqService from "~/services/faq";

const ImportFAQ: ScreenProps<"importFaq"> = ({route}) => {
  const fromGroupId = route.params.fromGroupId;
  const toGroupId = route.params.toGroupId;
  const navigation = useNavigation();

  /* State */
  const [faqs, setFaqs] = useState<FaqImportList>(FAQ_IMPORT_LIST_SAMPLE);

  /* UI state */
  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => setSnackBar(false);

  const pressItem = useCallback((index: number) => {
    setFaqs(prev => {
      const data = prev.data.map((item, _index) => {
        if (index === _index) {
          const status = item.status === "checked" ? "unchecked" : "checked";
          return {
            ...item,
            status: status,
          };
        }
        return item;
      });

      const totalChecked =
        data[index].status === "checked"
          ? prev.totalChecked + 1
          : prev.totalChecked - 1;

      const checkedAll: CheckBoxType =
        totalChecked === data.length ? "checked" : "unchecked";

      return {
        checkedAll,
        data,
        totalChecked,
      } as FaqImportList;
    });
  }, []);

  const pressCheckAll = useCallback(() => {
    setFaqs(prev => {
      const status: CheckBoxType =
        prev.checkedAll === "checked" ? "unchecked" : "checked";
      return {
        checkedAll: status,
        data: prev.data.map(item => {
          return {...item, status: status} as FaqModel;
        }),
        totalChecked: status === "checked" ? prev.data.length : 0,
      };
    });
  }, []);

  const renderHeader = useCallback(() => {
    if (faqs.data.length === 0) {
      return <></>;
    }
    return (
      <Checkbox.Item
        style={styles.checkbox}
        onPress={pressCheckAll}
        label="Chọn Tất cả"
        status={faqs.checkedAll}
        color={Color.primary}
        labelStyle={{fontWeight: "bold", fontSize: 18}}
      />
    );
  }, [faqs]);

  // render item
  const renderItem = useCallback(
    ({index, item}: {index: number; item: FaqModel}) => {
      return (
        <FAQItem
          onPress={() => pressItem(index)}
          faq={item}
          status={item.status}
        />
      );
    },
    [faqs],
  );

  // fecth api
  const fetchFAQs = async () => {
    try {
      const faqList = await FaqService.getGroupFAQs(fromGroupId);
      setFaqs(faqList);
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_GroupFAQ: ", error);

      setLoading(false);
      setMessage("Không thể tải FAQ của nhóm này.");
      setSnackBar(true);
    }
  };

  // side effect
  useEffect(() => {
    if (loading) {
      fetchFAQs();
    }
  }, [loading]);

  const headerRight = () => {
    return <HeaderSubmitButton onPress={onSubmit} />;
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    } as Partial<StackNavigationOptions>);
  });

  const onSubmit = async () => {
    const faqIds = faqs.data.filter(faq => faq.status == "checked").map(faq => faq.id);
    if (!faqIds) {
      setLoading(true);
      setMessage("Lỗi: Vui lòng chọn ít nhất một FAQ.");
      setSnackBar(true);
      return;
    }
    const payload = {
      fromGroupId: fromGroupId,
      faqIds: faqIds,
    };
    // call api import FAQ
    const isImported = await FaqApi.importFAQs(toGroupId, payload);
    if (!isImported) {
      setLoading(true);
      setMessage("Lỗi: Nhập FAQ thất bại");
      setSnackBar(true);
      return;
    }
    DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
      status: true,
      message: "Nhập FAQ thành công",
    });
    if (navigation.canGoBack()) {
      navigation.goBack();
      navigation.goBack();
    }
  };

  const _ListEmptyComponent = () => {
    if (loading) {
      return <></>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}> Nhòm này chưa có FAQ nào</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={faqs.data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        ItemSeparatorComponent={() => <SizedBox height={8} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={_ListEmptyComponent}
        refreshing={loading}
        onRefresh={() => setLoading(true)}
      />
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1000}>
        {message}
      </Snackbar>
    </View>
  );
};

export default ImportFAQ;
