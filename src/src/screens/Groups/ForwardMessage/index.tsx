import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupItem from '~/components/GroupItem';
import { GroupModel } from '~/models/group';
import { useQueryGroupList } from '~/screens/Home/queries';
import { ScreenProps } from '~/types/navigation'
import styles from './styles';
import { Line } from '~/components/Separator';
import GroupItemCheckbox from '~/components/GroupItemCheckbox';

const ForwardMessage: ScreenProps<"forwardMessage"> = ({route}) => {
    const message = route.params.message;
    const data = useQueryGroupList();
    const renderItem = useCallback(({item}: {item: GroupModel}) => {
        const onPress = () => {
        //   queryAction.seenNewMessage(item.id);
        //   navigation.navigate("workspace", {groupId: item.id});
        };
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
    return (
        <SafeAreaView>
            <Text>{message}</Text>
            <Text>Nhận xét: </Text>
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
    )
}
export default ForwardMessage;
