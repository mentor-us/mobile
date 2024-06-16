import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { ScreenProps } from "~/types/navigation";
import { useGetAllNoteOfUserQuery } from "~/app/server/notes/queries";

const UserNotes: ScreenProps<"userNotes"> = ({ navigation, route }) => {
  const { userId, userName } = route.params;
  const { data } = useGetAllNoteOfUserQuery(userId);
  console.log(data);
  return (
    <SafeAreaView>
      <View>
        <Text>UserNote {userName}</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserNotes;
