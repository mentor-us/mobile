import { useForm, Controller } from "react-hook-form";
import { View } from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { MarkTitleIcon, ParagraphIcon } from "~/assets/svgs";
import MUITextInput from "~/components/MUITextInput";
import SizedBox from "~/components/SizedBox";
import { ScreenProps } from "~/types/navigation";
import styles from "./styles";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { Color } from "~/constants/Color";
import { ShortProfileUserModel } from "./../../../models/user";
import { Button } from "@rneui/themed";
import GlobalStyles from "~/constants/GlobalStyles";

interface RenderUserProfileProps
  extends Omit<ShortProfileUserModel, "imageUrl"> {
  imageUrl: {
    uri: string;
  };
}

const CreateOrUpdateNote: ScreenProps<"createOrUpdateNote"> = ({
  navigation,
  route,
}) => {
  const { noteId } = route.params;
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      userIds: [],
      public: true,
    },
  });

  const onSubmit = data => console.log(data);

  navigation.setOptions({
    title: noteId ? "Cập nhật ghi chú" : "Tạo ghi chú",
  });

  const [selectedItemObjects, setSelectedItemObjects] = useState<
    RenderUserProfileProps[]
  >([]);

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
    <SafeAreaView style={{ flex: 1 }}>
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
        <View style={styles.fieldContainer}>
          <View>
            <SizedBox height={16} />
            <ParagraphIcon width={24} height={24} />
          </View>
          <SizedBox width={16} />
          <Controller
            name="content"
            control={control}
            rules={{ required: "Nội dung ghi chú không được để trống" }}
            render={({ field: { onChange, ...rest } }) => {
              return (
                <MUITextInput
                  label="Nội dung ghi chú *"
                  keyboardType={"default"}
                  multiline
                  numberOfLines={10}
                  style={{ textAlignVertical: "top" }}
                  onChangeText={onChange}
                  {...rest}
                  errorText={errors?.content?.message}
                />
              );
            }}
          />
        </View>

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
                  items={[
                    {
                      name: "Vinh1",
                      imageUrl: {
                        uri: "https://assets-global.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
                      },
                      email: "de",
                      id: 0,
                    },
                    {
                      name: "Cars2",
                      imageUrl: {
                        uri: "https://assets-global.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
                      },
                      email: "dqvinh20@gmail.com",
                      id: 1,
                    },
                  ]}
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
                    itemText: { marginLeft: 4, fontSize: 20 },
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
    </SafeAreaView>
  );
};

export default CreateOrUpdateNote;
