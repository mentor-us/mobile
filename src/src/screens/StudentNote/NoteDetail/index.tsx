import React, { useCallback, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Dimensions, useWindowDimensions } from "react-native";
import { ScreenProps } from "~/types/navigation";
import { useGetNoteDetailQuery } from "~/app/server/notes/queries";
import { Chase } from "react-native-animated-spinkit";
import LinearGradient from "react-native-linear-gradient";
import { Skeleton } from "@rneui/themed";
import SizedBox from "~/components/SizedBox";
import GlobalStyles from "~/constants/GlobalStyles";
import { Timeline } from "react-native-just-timeline";
import { Color } from "~/constants/Color";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  CoreBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useEditorBridge,
} from "@10play/tentap-editor";
import { ActivityIndicator } from "react-native-paper";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import {
  NoteDetail as NoteDetailModel,
  NoteHistory,
  NoteUserProfile,
} from "~/models/note";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import dayjs from "dayjs";
import RenderHTML from "react-native-render-html";

const editorCss = `
 * {
   font-family: sans-serif;
 }
 body {
 }
 img {
   max-width: 80%;
   height: auto;
   padding: 0 10%;
 }
`;

const buildViewHistoryData = (histories: NoteHistory[], width: number) => {
  return histories.map(history => ({
    time: {
      content: dayjs(history.createdDate).format("HH:MM DD/MM/YYYY"),
      style: {
        paddingTop: 8,
        color: "#666",
        fontSize: 12,
      },
    },
    title: () => (
      <View>
        <Text>
          <Text
            style={{
              color: "#333",
              fontSize: 14,
              fontWeight: "bold",
              marginRight: 4,
            }}
            numberOfLines={1}>
            {history.updatedBy.name}{" "}
          </Text>
          <Text
            style={{ color: "#333", fontSize: 14, fontWeight: "normal" }}
            numberOfLines={1}>
            đã cập nhật
          </Text>
        </Text>
        <Text>
          <Text
            style={{
              color: "#333",
              fontSize: 14,
              fontWeight: "bold",
              marginRight: 4,
            }}
            numberOfLines={1}>
            Tiêu đề:{" "}
          </Text>
          <Text
            style={{ color: "#333", fontSize: 14, fontWeight: "normal" }}
            numberOfLines={1}>
            {history.title}
          </Text>
        </Text>
      </View>
    ),
    description: () => {
      return (
        <View>
          <Text
            style={{
              color: "#333",
              fontSize: 14,
              fontWeight: "bold",
              marginRight: 4,
            }}
            numberOfLines={1}>
            Nội dung ghi chú:{" "}
          </Text>
          <RenderHTML
            contentWidth={width}
            enableExperimentalMarginCollapsing={true}
            source={{
              html: history.content,
            }}
            tagsStyles={{
              body: {
                padding: 0,
              },
              p: {
                padding: 0,
                margin: 0,
              },
            }}
          />
        </View>
      );
    },
    icon: () => (
      <View>
        <CacheImage
          url={Helper.getImageUrl(history.updatedBy.imageUrl)}
          style={styles.timelineAvatarStyle}
        />
      </View>
    ),
  }));
};

interface ViewNoteDetail extends NoteDetailModel {
  noteHistories: NoteHistory[];
}

const NoteDetail: ScreenProps<"noteDetail"> = ({ navigation, route }) => {
  const { noteId } = route.params;
  const { data, isLoading } = useGetNoteDetailQuery<ViewNoteDetail>(noteId);
  const { width } = useWindowDimensions();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data?.title || "...",
    });
  }, [data]);

  const LoadingComponent = useCallback(() => {
    return (
      <View
        style={{
          padding: 12,
          backgroundColor: Color.backgroundGray,
          height: Dimensions.get("window").height,
        }}>
        <View>
          <Skeleton
            width={"100%"}
            height={300}
            LinearGradientComponent={LinearGradient}
            animation="wave"
          />
          <SizedBox height={12} />
          <Skeleton
            width={"100%"}
            height={100}
            LinearGradientComponent={LinearGradient}
            animation="wave"
          />
          <SizedBox height={12} />
        </View>
        <TimelineHeader />
        <SizedBox height={8} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Chase size={50} color={Color.primary} />
        </View>
      </View>
    );
  }, []);

  const TimelineHeader = useCallback(
    () => (
      <View style={styles.timelineHeadingContainer}>
        <Text style={styles.timelineHeadingTitleText}>Lịch sử ghi chú</Text>
      </View>
    ),
    [],
  );

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    editable: false,
    initialContent: data?.content || "",
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(editorCss),
      PlaceholderBridge.configureExtension({
        showOnlyCurrent: false,
        placeholder: "Nội dung ghi chú *",
      }),
    ],
  });

  useEffect(() => {
    editor.setContent(data?.content || "");
  }, [data]);

  const noteHistoryData = useMemo(() => {
    return buildViewHistoryData(data?.noteHistories || [], width);
  }, [data, width]);

  const Body = () => {
    return (
      <ScrollView>
        <View style={{ padding: 12 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", color: Color.primary }}>
            Nội dung ghi chú:
          </Text>
          <View
            style={[
              {
                width: "100%",
                minHeight: 200,
                paddingHorizontal: 12,
                marginTop: 8,
                backgroundColor: Color.white,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#e0e0e0",
              },
            ]}>
            <RichText editor={editor} />
          </View>
          <SizedBox height={20} />
          <Text
            style={{ fontSize: 18, fontWeight: "bold", color: Color.primary }}>
            Sinh viên được ghi chú:
          </Text>
          <SizedBox height={8} />

          <SectionedMultiSelect<NoteUserProfile>
            loading={isLoading}
            items={data?.users}
            uniqueKey="id"
            displayKey="name"
            disabled={true}
            loadingComponent={
              <ActivityIndicator
                size={32}
                style={{ marginTop: 10 }}
                color={Color.primary}
              />
            }
            selectedItems={[...(data?.users?.map(user => user.id) || [])]}
            IconRenderer={Icon}
            modalSupportedOrientations={["portrait"]}
            modalAnimationType="slide"
            modalWithSafeAreaView
            modalWithTouchable
            // Custom static text
            selectText="Chọn người muốn ghi chú *"
            selectedText="đã chọn"
            searchPlaceholderText="Tìm mentee..."
            removeAllText="Xóa tất cả"
            noResultsComponent={
              <View>
                <SizedBox height={16} />
                <Text style={GlobalStyles.textAlignCenter}>
                  Không tìm thấy kết quả
                </Text>
              </View>
            }
            noItemsComponent={
              <View>
                <SizedBox height={16} />
                <Text style={GlobalStyles.textAlignCenter}>
                  Bạn đang không mentor ai cả
                </Text>
              </View>
            }
            confirmText="Xác nhận"
            colors={{ primary: Color.primary }}
            itemNumberOfLines={1}
            styles={{
              searchBar: { backgroundColor: "#f5f5f5" },
              backdrop: styles.multiSelectBackdrop,
              selectToggle: {
                ...styles.multiSelectBox,
                borderColor: "#e0e0e0",
              },
              chipContainer: styles.multiSelectChipContainer,
              chipText: styles.multiSelectChipText,
              item: {
                height: 46,
              },
              itemText: { marginLeft: 4, fontSize: 16 },
              itemIconStyle: {
                width: 30,
                height: 30,
                marginHorizontal: 2,
              },
              chipIcon: {
                display: "none",
              },
            }}
            chipRemoveIconComponent={null}
            hideSelect
            hideSearch={true}
            showChips={true}
            showRemoveAll={false}
            showDropDowns={false}
          />
        </View>
        <TimelineHeader />
        <SizedBox height={8} />
        <View
          style={{
            paddingHorizontal: 12,
          }}>
          <Timeline
            data={noteHistoryData}
            lineStyle={{ backgroundColor: Color.primary }}
            timeContainerStyle={styles.timelineTimeContainerStyle}
            contentContainerStyle={styles.timelineContentContainerStyle}
            renderHeader={TimelineHeader}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.fullFlex}>
      {isLoading ? <LoadingComponent /> : <Body />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  timelineTimeContainerStyle: {
    flexBasis: "20%",
    margin: 0,
    padding: 0,
  },
  timelineContentContainerStyle: { flex: 1 },
  timelineHeadingContainer: { paddingHorizontal: 12, paddingVertical: 0 },
  timelineHeadingTitleText: {
    color: Color.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineAvatarStyle: {
    borderColor: "#fff",
    borderRadius: 25,
    borderWidth: 3,
    height: 45,
    width: 45,
  },

  multiSelectBackdrop: {
    // backgroundColor: "rgba(255, 183, 0, 0.2)",
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#bbb",
    padding: 12,
    marginBottom: 12,
  },
  multiSelectChipContainer: {
    borderWidth: 0,
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingRight: 10,
  },
  multiSelectChipText: {
    color: "#222",
    fontSize: 14.5,
  },
});

export default NoteDetail;
