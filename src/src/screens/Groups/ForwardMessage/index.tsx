import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupItem from "~/components/GroupItem";
import { GroupModel } from "~/models/group";
import { useQueryGroupList } from "~/screens/Home/queries";
import { ScreenProps } from "~/types/navigation";
import styles from "./styles";
import { Line } from "~/components/Separator";
import GroupItemCheckbox from "~/components/GroupItemCheckbox";
import { useNavigation } from "@react-navigation/native";
import { HeaderCloseButton, HeaderSubmitButton } from "~/components/Header";
import { StackNavigationOptions } from "@react-navigation/stack";
import TextContent from "../Chat/MessagesContainer/MessageItem/TextContent";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import Helper from "~/utils/Helper";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import clip from "text-clipper";

const ForwardMessage: ScreenProps<"forwardMessage"> = ({ route }) => {
  const [listChannel, setListChannel] = useState<string[]>([]);
  const message = route.params.message;
  const messageID = route.params.messageID;
  const messageType = route.params.messageType;
  const data = useQueryGroupList();
  const navigation = useNavigation();
  const onPress = id => {
    setListChannel(pre => {
      if (!pre.includes(id)) {
        return [...pre, id];
      } else {
        return pre.filter(channelId => channelId != id);
      }
    });
  };
  const renderItem = useCallback(({ item }: { item: GroupModel }) => {
    return (
      <View style={[styles.itemCtn]}>
        <GroupItemCheckbox onPress={onPress} group={item} />
      </View>
    );
  }, []);
  const onRefresh = () => {
    data.refetch();
  };
  const onEndReached = () => {
    if (data.hasNextPage) {
      data.fetchNextPage();
    }
  };
  const handleSubmit = () => {};
  const headerRight = useCallback(listChannel => {
    if (!listChannel.length) return;

    return <HeaderSubmitButton onPress={handleSubmit} />;
  }, []);

  const headerLeft = useCallback(() => {
    return <HeaderCloseButton canGoBack />;
  }, []);

  const setHeaderRight = listChannel => {
    const title = "Chuyển tiếp tin nhắn";
    navigation.setOptions({
      headerRight: () => headerRight(listChannel),
      headerLeft,
      title: title,
    } as StackNavigationOptions);
  };

  useEffect(() => {
    setHeaderRight(listChannel);
  }, [listChannel]);
  const composed = Gesture.Simultaneous();

  const trimmedContent = Helper.trimHTMLContent(message ?? "").replace(/<div><br><\/div>/g, '');
  function getContentOfNLines(inputString: string, n: number): string[] {
    const divRegex = /<div>(.*?)<\/div>/g;
    let lines: string[] = [];
    let match: RegExpExecArray | null;
  
    // Find all matches using the regex
    while ((match = divRegex.exec(inputString)) !== null) {
      lines.push(match[1]);
    }
  
    // Return the first n lines
    return lines.slice(0, n);
  }
  const result = getContentOfNLines(trimmedContent, 6);

  return (
    <SafeAreaView>
      <View style={[styles.reviewMessageContainer]}>
        <Text style={[
            styles.textInfo,
            styles.displayName,
            styles.boldText,
          ]}>Xem trước tin nhắn</Text>
        {messageType == "TEXT" && (
          <GestureDetector gesture={composed}>
            <TouchableWithoutFeedback style={[styles.messageContainer]}>
              <TextFormatRenderer
                text={result.join("<br>")}
                style={styles.dimmedText}
                numberOfLines={4}
              />
            </TouchableWithoutFeedback>
          </GestureDetector>
        )}
      </View>
      {/* <Text>{trimmedContent}</Text> */}
      <Text>Nhận xét: </Text>
      <Text>Search: </Text>
      <FlatList
        data={!data.data ? [] : data.data.pages.flat()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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
export default ForwardMessage;
