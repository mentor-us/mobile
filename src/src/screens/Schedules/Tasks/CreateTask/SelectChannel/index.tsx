import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./styles";
import { observer } from "mobx-react-lite";
import { useCreateTaskScreenState } from "~/context/task";
import { GroupModel, GROUP_SAMPLE, GroupChannel } from "~/models/group";
import { useQueryChannelList } from "~/queries/channels";
import { ActivityIndicator, List, Searchbar } from "react-native-paper";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import useDebounce from "~/hooks/useDebounce";
import { Color } from "~/constants/Color";

interface ChannelPage {
  groupName: string;
  group?: GroupModel;
  channels: GroupChannel[];
  expanded?: boolean;
}

const SelectChannel = () => {
  const state = useCreateTaskScreenState();
  const [chosenGroup, setChosenGroup] = useState<GroupChannel>();
  const { data, isSuccess, isLoading, isFetching, refetch } =
    useQueryChannelList("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredChannelList, setFilteredChannelList] = React.useState<
    ChannelPage[]
  >([]);

  const onChangeSearch = query => setSearchQuery(query);

  const channelList = useMemo(() => {
    if (!isSuccess) {
      return [];
    }
    const groupChannel = data?.pages
      ?.flatMap(channel => channel)
      .reduce((acc, channel) => {
        (acc[channel.groupName] = acc[channel.groupName] || []).push(channel);
        return acc;
      }, {} as Record<string, GroupChannel[]>);

    return Object.keys(groupChannel).reduce<ChannelPage[]>((acc, groupName) => {
      acc.push({
        groupName,
        group:
          groupChannel[groupName].length > 0
            ? groupChannel[groupName][0].group
            : GROUP_SAMPLE,
        channels: groupChannel[groupName],
        expanded: true,
      });
      return acc;
    }, []);
  }, [isSuccess]);

  useDebounce(
    () => {
      setFilteredChannelList(() => {
        if (searchQuery === "") {
          return channelList;
        }

        return channelList
          .map(channelPage => {
            return {
              ...channelPage,
              channels: channelPage.channels.filter(channel => {
                return channel.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              }),
            };
          })
          .filter(channelPage => channelPage.channels.length > 0);
      });
    },
    [channelList, searchQuery],
    200,
  );

  const renderItem = useCallback(
    ({ item }: { item: ChannelPage }) => {
      return (
        <View style={[styles.itemCtn]}>
          <List.Accordion
            expanded={item.expanded}
            onPress={() => {
              item.expanded = !item.expanded;
              console.log(filteredChannelList);
              setFilteredChannelList([...filteredChannelList]);
            }}
            id={item.groupName}
            title={item.groupName}
            titleStyle={{
              color: item.expanded ? Color.primary : Color.black,
            }}
            left={() => (
              <CacheImage
                url={Helper.getImageUrl(item?.group?.imageUrl)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              />
            )}>
            {item.channels.map(channel => (
              <List.Item
                key={channel.id}
                title={channel.name}
                description={channel.description}
                onPress={() => {
                  setChosenGroup(channel);
                  state.setActionDone("submit_group");
                }}
              />
            ))}
          </List.Accordion>
        </View>
      );
    },
    [filteredChannelList],
  );

  const EmptyListMessage = () => {
    if (
      isLoading ||
      isFetching ||
      (isSuccess &&
        channelList &&
        channelList.length > 0 &&
        searchQuery === "" &&
        filteredChannelList.length === 0)
    ) {
      return (
        <ActivityIndicator
          style={{ marginTop: 12 }}
          size={40}
          animating={true}
          color={Color.primary}
        />
      );
    }

    return (
      <Text style={styles.textMess}>
        {searchQuery === ""
          ? "Bạn không có trong kênh nào"
          : `Không tìm thấy kênh với từ khoá '${searchQuery}'`}
      </Text>
    );
  };

  useEffect(() => {
    if (state.actionDone === "submit_group") {
      state.submitGroup(chosenGroup ? chosenGroup.id : "");
    }
  }, [state.actionDone]);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Searchbar
        style={{
          margin: 10,
        }}
        placeholder="Tìm kiếm kênh"
        onChangeText={onChangeSearch}
        value={searchQuery}
        maxLength={100}
      />
      <FlatList
        data={filteredChannelList}
        renderItem={renderItem}
        keyExtractor={item => {
          return item.groupName;
        }}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        ListEmptyComponent={EmptyListMessage}
      />
    </View>
  );
};

export default observer(SelectChannel);
