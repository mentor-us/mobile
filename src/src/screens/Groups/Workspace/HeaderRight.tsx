import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { AdjustmentIcon } from "~/assets/svgs";
import { Color } from "~/constants/Color";

interface Props {
  groupId: string;
}

const HeaderRight = ({ groupId }: Props) => {
  const navigation = useNavigation();
  const openGroupDetail = () =>
    navigation.navigate("groupDetail", { groupId: groupId, type: "group" });
  return (
    <View style={{ flexDirection: "row", marginRight: 12 }}>
      <TouchableOpacity
        style={{
          padding: 8,
          backgroundColor: Color.secondary,
          marginHorizontal: 2,
          borderRadius: 24,
        }}
        onPress={openGroupDetail}>
        <AdjustmentIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
