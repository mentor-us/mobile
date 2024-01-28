import React, { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupItem from "~/components/GroupItem";
import { GroupChannel, GroupModel } from "~/models/group";
import { useQueryGroupList } from "~/screens/Home/queries";
import { ScreenProps } from "~/types/navigation";
import styles from "./styles";
import { Line } from "~/components/Separator";
import ChannelItemCheckbox from "~/components/ChannelItemCheckbox";
import { useNavigation } from "@react-navigation/native";
import { HeaderCloseButton, HeaderSubmitButton } from "~/components/Header";
import { StackNavigationOptions } from "@react-navigation/stack";
import TextContent from "../Chat/MessagesContainer/MessageItem/TextContent";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import Helper from "~/utils/Helper";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import clip from "text-clipper";
import MUITextInput from "~/components/MUITextInput";
import SizedBox from "~/components/SizedBox";
import {
  MarkTitleIcon,
  PencilBlack,
  PencilEditOffice,
  SearchBlackIcon,
  SearchIcon,
} from "~/assets/svgs";
import { useQuery } from "@tanstack/react-query";
import GroupService from "~/services/group";
import ListFooter from "~/screens/Home/General/ListFooter";
import ChannelService from "~/services/channel";
import { useQueryChannelList } from "~/queries/channels";
import ImageList from "../Chat/MessagesContainer/MessageItem/ImageList";
import GridThumbnail from "~/components/GridThumbnail";
import { screenWidth } from "~/constants";
import EventEmitterNames from "~/constants/EventEmitterNames";
import Toast from "react-native-root-toast";

const ForwardMessage: ScreenProps<"forwardMessage"> = ({ route }) => {
  const [listChannelId, setListChannelId] = useState<string[]>([]);
  // Todo change GroupModel to Channel Model
  const [listChannelChoosen, setListChannelChoosen] = useState<GroupChannel[]>(
    [],
  );
  const comment = useRef<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const message = route.params.message;
  const messageId = route.params.messageID;
  const messageType = route.params.messageType;
  const images = route.params.images;
  const data = useQueryChannelList(search);

  const navigation = useNavigation();
  const onPress = group => {
    var id = group.id;
    setListChannelChoosen(pre => {
      if (!pre.filter(item => item.id == group.id).length) {
        return [...pre, group];
      } else {
        return pre.filter(item => item.id != group.id);
      }
    });
    setListChannelId(pre => {
      if (!pre.includes(id)) {
        return [...pre, id];
      } else {
        return pre.filter(channelId => channelId != id);
      }
    });
  };
  const renderListHeader = () => {
    if (listChannelChoosen.length == 0) {
      return <></>;
    }
    return listChannelChoosen.map(item => {
      return (
        <View key={item.id} style={[styles.itemCtn]}>
          <ChannelItemCheckbox onPress={onPress} channel={item} initState={true} />
        </View>
      );
    });
  };

  const renderItem = useCallback(({ item }: { item: GroupChannel }) => {
    return (
      <View key={item.id} style={[styles.itemCtn]}>
        <ChannelItemCheckbox onPress={onPress}  channel={item} />
      </View>
    );
  }, []);
  const filterDataQuery = !data.data
    ? []
    : data.data.pages.flat().filter(item => !listChannelId.includes(item.id));
  const onRefresh = () => {
    // data.refetch();
  };

  const onEndReached = () => {
    if (data.hasNextPage) {
      data.fetchNextPage();
    }
  };

  const handleSubmit = listChannelId => {
    console.log("handleSubmit");
    console.log(messageId);
    console.log(listChannelId);
    ChannelService.forward(
      messageId,
      listChannelId
    ).then((res:any)=>{
      console.log("Submit success")
      Toast.show("Chuyển tiếp tin nhắn thành công", {
        position: Toast.positions.BOTTOM
      })
      if(navigation.canGoBack()){
        navigation.goBack()
      }
    }).catch((err)=>{
      console.log("Submit fail")

    })
  };
  const headerRight = useCallback(listChannelId => {
    if (!listChannelId.length) return;

    return <HeaderSubmitButton onPress={() => handleSubmit(listChannelId)} />;
  }, []);

  const headerLeft = useCallback(() => {
    return <HeaderCloseButton canGoBack />;
  }, []);

  const setHeaderRight = listChannelId => {
    const title = "Chuyển tiếp tin nhắn";
    navigation.setOptions({
      headerRight: () => headerRight(listChannelId),
      headerLeft,
      title: title,
    } as StackNavigationOptions);
  };

  
  const composed = Gesture.Simultaneous();
 
  const trimmedContent = Helper.trimHTMLContent(message ?? "").replace(
    /<div><br><\/div>/g,
    "",
  );
  function getContentOfNLines(inputString: string, n: number): string[] {
    if(!inputString || inputString[0] != "<") return [inputString];
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
  useEffect(() => {
    setHeaderRight(listChannelId);
  }, [listChannelId]);

  useEffect(() => {
    // console.log(listChannelChoosen)
  }, [listChannelChoosen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      if(search!=searchTerm){
        setSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    // var fecthData = async () => {
    //   const channel: GroupChannel[] = await ChannelService.search(search);
    //   console.log(channel);
    // };
    // fecthData();
  }, [search]);
  useEffect(() => {
    setSearch("");
  }, []);
  return (
    <SafeAreaView style={[]}>
      <View style={[styles.reviewMessageContainer]}>
        <Text style={[styles.textInfo, styles.displayName, styles.boldText]}>
          Xem trước tin nhắn
        </Text>
        {messageType == "TEXT" && (
          <GestureDetector gesture={composed}>
            <TouchableWithoutFeedback style={[styles.messageContainer]}>
              <TextFormatRenderer
                text={result.join('<br>')}
                style={styles.dimmedText}
                numberOfLines={4}
              />
            </TouchableWithoutFeedback>
          </GestureDetector>
        )}
        {/* {messageType == "IMAGE" && (
          <GridThumbnail
          useSkeletonWhenLoad
          maxWidth={screenWidth * 0.8}
          mediaData={images || []}
        />
          // <ImageList message={message} key={message.id} />
        )} */}
      </View>
      {/* <Text>{trimmedContent}</Text> */}
      {/* <View
        style={[
          styles.fieldContainer,
          styles.paddingItem,
          { width: "100%", borderRadius: 5 },
        ]}>
        <View>
          <SizedBox height={16} />
          <PencilBlack width={24} height={24} />
        </View>
        <SizedBox width={16} />
        <MUITextInput
          label="Thêm Nhận xét"
          keyboardType={"default"}
          value={comment.current}
          onChangeText={text => {
            comment.current = text;
          }}
          multiline
          numberOfLines={2}
          errorText={""}
          style={{ textAlignVertical: "top" }}
        />
      </View> */}
      <View
        style={[
          styles.fieldContainer,
          styles.paddingItem,
          { width: "100%", marginTop: 10 },
        ]}>
        <View>
          <SizedBox height={16} />
          <SearchBlackIcon width={24} height={24} />
        </View>
        <SizedBox width={16} />
        <MUITextInput
          label="Tìm kiếm kênh"
          keyboardType={"default"}
          value={searchTerm}
          onChangeText={text => {
            setSearchTerm(text);
          }}
          multiline
          numberOfLines={2}
          errorText={""}
          style={{ textAlignVertical: "top", width: "100%" }}
        />
      </View>

      {/* {
        true ? 
        <ListFooter onRefresh={onRefresh} loading={true} />
        :
        <></>
      } */}
      <FlatList
        data={filterDataQuery}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={[styles.container, { marginTop: 10 }]}
        keyExtractor={item => `recent-group-${item.id}`}
        ListHeaderComponent={renderListHeader}
        refreshing={data.isFetching}
        onEndReachedThreshold={0.5}
        // onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </SafeAreaView>
  );
};
export default ForwardMessage;
