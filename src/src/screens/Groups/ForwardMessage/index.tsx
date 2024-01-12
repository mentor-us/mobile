import React, { useCallback, useEffect, useState } from 'react'
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
import { useNavigation } from '@react-navigation/native';
import { HeaderCloseButton, HeaderSubmitButton } from '~/components/Header';
import { StackNavigationOptions } from '@react-navigation/stack';

const ForwardMessage: ScreenProps<"forwardMessage"> = ({route}) => {
    const [listChannel,setListChannel] = useState<string[]>([])
    const message = route.params.message;
    const data = useQueryGroupList();
    const navigation = useNavigation();
    const onPress = (id) => {
      setListChannel(pre=> {
        if(!pre.includes(id)){  
          return [...pre,id]
        }else{
          return pre.filter(channelId => channelId != id)
        }
      })
    };
    const renderItem = useCallback(({item}: {item: GroupModel}) => {
      
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
    const handleSubmit = ()=>{

    }
    const headerRight = useCallback((listChannel) => {
      if (!listChannel.length) return;
  
      return <HeaderSubmitButton onPress={handleSubmit} />;
    }, []);

    const headerLeft = useCallback(() => {
      return <HeaderCloseButton canGoBack />;
    }, []);

    const setHeaderRight =(listChannel)=>{
      const title = "Chuyển tiếp tin nhắn";
      navigation.setOptions({
        headerRight : () =>headerRight(listChannel),
        headerLeft,
        title: title,
      } as StackNavigationOptions);
    }
    
    useEffect(()=>{
      setHeaderRight(listChannel)
    },[listChannel])
    
    return (
        <SafeAreaView>
            <Text>{message}</Text>
            <Text>Nhận xét1: </Text>
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
