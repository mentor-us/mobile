import {Text, TouchableOpacity, View} from "react-native";
import {CheckGoodIcon, CheckIcon, LockIcon, LockRedIcon, UnlockGreenIcon} from "~/assets/svgs";
import styles from "./styles";

interface Props {
  voteId: string;
  status: "OPEN" | "CLOSED";
  changeStatus: () => void;
}

const HeaderRight = ({voteId, status, changeStatus}: Props) => {
  const onAction = () => {
    changeStatus();
  };
  return (
    <View style={styles.headerRight}>
      {/* <TouchableOpacity style={styles.iconButton}>
          <SearchIcon width={20} height={20} />
        </TouchableOpacity> */}
      <TouchableOpacity style={styles.iconButton} onPress={onAction}>
        {status == "OPEN" ? (
          <View style={styles.headerBtn}>
            <LockRedIcon width={15} height={15} />
            <Text style={styles.closeBtn}>Khoá</Text>
          </View>
        ) : (
          <View style={styles.headerBtn}>
            <UnlockGreenIcon width={15} height={15} />
            <Text style={styles.reopenBtn}>Mở</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;
