import { useForm, Controller } from "react-hook-form";
import { View } from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { MarkTitleIcon } from "~/assets/svgs";
import MUITextInput from "~/components/MUITextInput";
import SizedBox from "~/components/SizedBox";
import { ScreenProps } from "~/types/navigation";
import styles from "./styles";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { Color } from "~/constants/Color";
import { ShortProfileUserModel } from "../../../models/user";
import { Button } from "@rneui/themed";
import GlobalStyles from "~/constants/GlobalStyles";
import { useInfinitySearchMentees } from "~/app/server/users/queries";
import Helper from "~/utils/Helper";
import { DefaultUserAvatar } from "~/assets/images";
import { CreateOrUpdateNoteDto } from "~/models/note";
import { Platform, Text } from "react-native";
import {
  CoreBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { KeyboardAvoidingView } from "react-native";
import { useGetNoteDetailQuery } from "~/app/server/notes/queries";
import AppLoadingIndicator from "~/components/AppLoadingIndicator";
import { AppContext } from "~/context/app";
import { useCreateOrUpdateNoteMutation } from "~/app/server/notes/mutation";
import AppErrorModal from "~/components/AppErrorModal";

interface RenderUserProfileProps
  extends Omit<ShortProfileUserModel, "imageUrl"> {
  imageUrl: {
    uri: string;
  };
}

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

const CreateOrUpdateNote: ScreenProps<"createOrUpdateNote"> = ({
  navigation,
  route,
}) => {
  const { noteId, userIds } = route.params;
  const { data: noteDetail, isInitialLoading: isNoteDetailInitialLoading } =
    useGetNoteDetailQuery(noteId);
  const { setIsLoading } = useContext(AppContext);
  const [queryMentee, setQueryMentee] = useState("");
  const [selectedItemObjects, setSelectedItemObjects] = useState<
    RenderUserProfileProps[]
  >([]);

  // React Hook Form
  const {
    control,
    handleSubmit,
    getValues,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateOrUpdateNoteDto>({
    defaultValues: {
      title: "",
      content: "",
      userIds: userIds ?? [],
    },
  });
  register("content", {
    required: "Nội dung ghi chú không được để trống",
  });

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    data,
    isSuccess,
    refetch: reloadSearch,
  } = useInfinitySearchMentees(queryMentee);
  const {
    mutateAsync,
    isError,
    error,
    reset: resetCreateOrUpdateNote,
  } = useCreateOrUpdateNoteMutation(noteId);

  // Rich text editor
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: getValues("content"),
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(editorCss),
      PlaceholderBridge.configureExtension({
        showOnlyCurrent: false,
        placeholder: "Nội dung ghi chú *",
      }),
    ],
    onChange: async () => {
      const text = await editor.getText();
      setValue(
        "content",
        text.trim().length === 0 ? "" : await editor.getHTML(),
      );
    },
  });

  useEffect(() => {
    // reset form with note data
    reset({
      title: noteDetail?.title ?? "",
      content: noteDetail?.content ?? "",
      userIds: !noteId
        ? userIds ?? []
        : noteDetail?.users.map(user => user.id) ?? [],
    });
    if (editor.editable) {
      editor.setContent(noteDetail?.content ?? "");
    }
  }, [noteDetail]);

  useEffect(() => {
    setIsLoading(isNoteDetailInitialLoading);
  }, [isNoteDetailInitialLoading]);

  const onSubmit = async (createNoteDto: CreateOrUpdateNoteDto) => {
    setIsLoading(true);
    mutateAsync(createNoteDto, {
      onSuccess: () => {
        navigation.goBack();
      },
      onSettled() {
        setIsLoading(false);
      },
    });
  };

  navigation.setOptions({
    title: noteId ? "Cập nhật ghi chú" : "Tạo ghi chú",
  });

  function renderSelectText() {
    const selectedUserIds = getValues("userIds");

    const c = selectedUserIds.length;
    if (c <= 3) {
      return selectedItemObjects
        .map(item => item.name)
        .join(", ")
        .replace(/, ([^,]*)$/, " và $1");
    }

    if (c > 3) {
      return `${c} người đã chọn`;
    }

    return "Chọn người muốn ghi chú *";
  }

  return (
    <SafeAreaView style={styles.fullScreen}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.fieldContainer}>
          <View>
            <SizedBox height={16} />
            <MarkTitleIcon />
          </View>
          <SizedBox width={16} />
          <Controller
            name="title"
            control={control}
            rules={{ required: "Tiêu đề không được để trống" }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <MUITextInput
                  label="Tiêu đề *"
                  keyboardType={"default"}
                  value={value}
                  onChangeText={text => {
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  errorText={errors?.title?.message}
                />
              );
            }}
          />
        </View>

        <View
          style={[
            styles.fieldContainer,
            {
              width: "100%",
              minHeight: 200,
              paddingHorizontal: 12,
              marginTop: 8,
              backgroundColor: Color.white,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: errors?.content ? "red" : "#e0e0e0",
            },
          ]}>
          <RichText editor={editor} />
        </View>
        <Text style={{ color: "red" }}>{errors?.content?.message}</Text>

        <View style={{ marginTop: 12 }}>
          <Controller
            name="userIds"
            control={control}
            rules={{
              validate: value => {
                if (value.length === 0) {
                  return "Phải chọn ít nhất một người để ghi chú";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <SectionedMultiSelect<RenderUserProfileProps>
                  onChangeSearchText={setQueryMentee}
                  items={
                    isSuccess
                      ? data?.pages.flat().map((user: any) => {
                          return {
                            ...user,
                            imageUrl: user.imageUrl
                              ? {
                                  uri: Helper.getImageUrl(user.imageUrl),
                                }
                              : DefaultUserAvatar,
                          };
                        })
                      : []
                  }
                  loading={isLoading}
                  itemsFlatListProps={{
                    refreshing: isRefetching,
                    onRefresh: reloadSearch,
                    onEndReached: hasNextPage ? fetchNextPage : null,
                    onEndReachedThreshold: 0.8,
                    ListFooterComponent: isFetchingNextPage && (
                      <ActivityIndicator
                        size={32}
                        style={{ marginTop: 10 }}
                        color={Color.primary}
                      />
                    ),
                  }}
                  uniqueKey="id"
                  iconKey="imageUrl"
                  loadingComponent={
                    <ActivityIndicator
                      size={32}
                      style={{ marginTop: 10 }}
                      color={Color.primary}
                    />
                  }
                  onSelectedItemsChange={onChange}
                  onSelectedItemObjectsChange={setSelectedItemObjects}
                  selectedItems={value}
                  IconRenderer={Icon}
                  modalSupportedOrientations={["portrait"]}
                  modalAnimationType="slide"
                  modalWithSafeAreaView
                  modalWithTouchable
                  renderSelectText={renderSelectText}
                  filterItems={(searchTerm, items) =>
                    items
                      ? items.filter(item => {
                          const parts = searchTerm
                            .replace(/[\^$\\.*+?()[\]{}|]/g, "\\$&")
                            .trim()
                            .split(" ");
                          const regex = new RegExp(`(${parts.join("|")})`, "i");

                          return (
                            regex.test(item.name) || regex.test(item.email)
                          );
                        })
                      : []
                  }
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
                      borderColor: errors?.userIds ? "red" : "#e0e0e0",
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
                  }}
                  showChips={true}
                  showRemoveAll={true}
                  showDropDowns={true}
                />
              );
            }}
          />
          <View style={{ marginTop: -8 }}>
            <Text style={{ color: "red" }}>{errors?.userIds?.message}</Text>
          </View>
        </View>
      </View>

      <Button
        containerStyle={styles.submitButtonContainer}
        buttonStyle={styles.submitButton}
        title={noteId ? "Cập nhật ghi chú" : "Tạo ghi chú"}
        onPress={() => handleSubmit(onSubmit)()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}>
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>

      <AppLoadingIndicator />
      <AppErrorModal
        hasError={isError}
        error={error}
        onPress={resetCreateOrUpdateNote}
        onRequestClose={resetCreateOrUpdateNote}
      />
    </SafeAreaView>
  );
};

export default CreateOrUpdateNote;
