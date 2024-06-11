import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Avatar, Card, Searchbar } from "react-native-paper";
import { ShortProfileUserModel } from "~/models/user";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";
import styles from "./styles";
import { FAB } from "@rneui/themed";
import { Color } from "~/constants/Color";
import { useNavigation } from "@react-navigation/native";

function StudentNote() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);
  const data: ShortProfileUserModel[] = [
    {
      id: "1",
      name: "Dương Quang Vinh",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9AuDc53EBhPtkswfxfjyiGUql1wtc7izhjw&s",
    },
    {
      id: "2",
      name: "Dương Quang Vinh",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9AuDc53EBhPtkswfxfjyiGUql1wtc7izhjw&s",
    },
    {
      id: "3",
      name: "Dương Quang Vinh",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9AuDc53EBhPtkswfxfjyiGUql1wtc7izhjw&s",
    },
  ];

  const onUserPress = () => {};

  const renderItem = ({ item }: ListRenderItemInfo<ShortProfileUserModel>) => {
    return (
      <TouchableOpacity onPress={onUserPress}>
        <Card.Title
          style={styles.userCard}
          title={item.name}
          titleNumberOfLines={1}
          subtitle="Có 4 ghi chú về người này"
          subtitleNumberOfLines={1}
          left={props => {
            return (
              <Avatar.Image
                style={styles.userCardIcon}
                {...props}
                source={() => (
                  <CacheImage
                    url={Helper.getImageUrl(item.imageUrl)}
                    style={{
                      width: props.size,
                      height: props.size,
                      borderRadius: props.size,
                    }}
                  />
                )}
              />
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        style={{
          marginVertical: 10,
        }}
        placeholder="Tìm bằng tên hoặc email"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList<ShortProfileUserModel>
        data={data}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.empty}>
              <View style={styles.fake}>
                <View style={styles.fakeCircle} />
                <View>
                  <View style={[styles.fakeLine, { width: 120 }]} />
                  <View style={styles.fakeLine} />
                  <View
                    style={[styles.fakeLine, { width: 70, marginBottom: 0 }]}
                  />
                </View>
              </View>
              <View style={[styles.fake, { opacity: 0.5 }]}>
                <View style={styles.fakeCircle} />
                <View>
                  <View style={[styles.fakeLine, { width: 120 }]} />
                  <View style={styles.fakeLine} />
                  <View
                    style={[styles.fakeLine, { width: 70, marginBottom: 0 }]}
                  />
                </View>
              </View>
              <Text style={styles.emptyTitle}>
                Chưa có ghi chú cho sinh viên nào
              </Text>
              <Text style={styles.emptyDescription}>
                Once you start a new conversation, you'll see new messages here
              </Text>
            </View>
          </View>
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <FAB
        style={styles.fab}
        icon={{ name: "add", color: "white" }}
        onPress={() => navigation.navigate("createOrUpdateNote", {})}
        color={Color.primary}
      />
    </SafeAreaView>
  );
}

export default StudentNote;
