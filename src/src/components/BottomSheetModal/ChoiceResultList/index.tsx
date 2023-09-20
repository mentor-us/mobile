import {FlatList, Text, View} from "react-native";
import {ChoiceResult} from "~/models/vote";
import styles from "./styles";
import {BottomSheetModalRef} from "../index.props";
import {useCallback} from "react";
import SizedBox from "~/components/SizedBox";
import {VoteItem} from "./VoterItem";

interface Props {
  choice: ChoiceResult;
  groupId: string;
}

export const ChoiceResultList = ({choice, groupId}: Props) => {
  const _renderItem = ({item, index}) => {
    return <VoteItem voter={item} close={close} groupId={groupId} />;
  };

  const close = useCallback(() => {
    BottomSheetModalRef.current?.hide();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.panelHead}>
          <View style={styles.bar}></View>
          <Text style={styles.title}>Lựa chọn</Text>
        </View>
        <View style={styles.panelBody}>
          <FlatList
            data={choice.voters}
            keyExtractor={item => `${item.id}`}
            renderItem={_renderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => <SizedBox height={4} />}
          />
        </View>
      </View>
    </View>
  );
};
