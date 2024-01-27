import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ShortMedia } from "~/models/media";
import { commonStyles, styles } from "./styles";
import Helper from "~/utils/Helper";
import SizedBox from "~/components/SizedBox";
import FileItem from "./FileItem";

interface Props {
  data: ShortMedia[];
  loading: boolean;
  refresh: () => void;
}

export const FileGallery = ({ data, loading = false, refresh }: Props) => {
  const _renderMediaItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => console.log("Click file")}>
        <View style={styles.container}>
          <FileItem
            file={item.file}
            time={Helper.getTime(item.createdDate)}
            sender={item.sender}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const _ListEmptyComponent = () => {
    if (loading) {
      return <></>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nhóm chưa có tập tin nào</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={_renderMediaItem}
      showsVerticalScrollIndicator={false}
      style={commonStyles.flatlist}
      ItemSeparatorComponent={() => <SizedBox height={8} />}
      refreshing={loading}
      onRefresh={refresh}
      ListEmptyComponent={_ListEmptyComponent}
    />
  );
};
