import {View, Text, FlatList, Image} from "react-native";
import React from "react";
import ListHeader from "./ListHeader";
import styles from "./styles";
import {Reaction} from "~/models/reaction";
import {DefaultUserAvatar} from "~/assets/images";
import EmoijsData from "~/constants/Emoijs";
import GlobalStyles from "~/constants/GlobalStyles";
import SizedBox from "~/components/SizedBox";

interface Props {
  reactions?: Reaction[];
}

const UserReacted = ({reactions = []}: Props) => {
  const renderItem = ({item}: {item: Reaction}) => {
    return (
      <View style={styles.userCtn}>
        <View style={GlobalStyles.flexRow}>
          <Image
            source={item.imageUrl ? {uri: item.imageUrl} : DefaultUserAvatar}
            style={styles.avatar}
          />
          <SizedBox width={8} />
          <Text style={styles.name}>{item.name}</Text>
        </View>

        <View style={GlobalStyles.flexRow}>
          <View style={styles.totalReactedCtn}>
            {item.data.map((emoji, index) => {
              if (index > 2) return <></>;
              return (
                <Image
                  style={styles.emoji}
                  source={EmoijsData[emoji.id].source}
                  key={`${emoji.id} + ${emoji.total}`}
                />
              );
            })}
          </View>
          <SizedBox width={8} />
          <Text style={styles.name}>{item.total}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ListHeader />
      <FlatList
        data={reactions}
        renderItem={renderItem}
        scrollEnabled
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => `${item.userId}`}
      />
    </View>
  );
};

export default UserReacted;
