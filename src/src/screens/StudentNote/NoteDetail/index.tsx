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
import { FAB } from "@rneui/themed";
import { Color } from "~/constants/Color";
import { useNavigation } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";

const NoteDetail: ScreenProps<"noteDetail"> = ({ navigation, route }) => {
  const { noteId } = route.params;

  return (
    <SafeAreaView>
      <View>
        <Text>NoteDetail</Text>
      </View>
    </SafeAreaView>
  );
};

export default NoteDetail;
