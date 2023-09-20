import {View, Text, TouchableOpacity} from "react-native";
import React, {memo} from "react";
import {FaqModel, FAQ_SAMPLE} from "~/models/faq";
import Feather from "react-native-vector-icons/Feather";
import {FaqItemIcon} from "~/assets/svgs";
import GlobalStyles from "~/constants/GlobalStyles";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import CheckBox from "./CheckBox";
import { CheckBoxType } from "~/models/commonTypes";

interface Props {
  faq?: FaqModel;
  onPress?: () => void;
  status?: CheckBoxType;
}

const FAQItem = ({faq = FAQ_SAMPLE, onPress, status = "indeterminate"}: Props) => {
  return (
    <TouchableOpacity style={[]} onPress={onPress}>
      <View style={styles.infoCtn}>
        <View style={GlobalStyles.flexRow}>
          <SizedBox width={10} />
          <FaqItemIcon width={20} height={20} />
          <SizedBox width={10} />
          <View style={styles.detailCtn}>
            <Text style={styles.textQuestion}>{faq.question}</Text>
            {faq.voters.length > 0 && <Text style={styles.voteText}>+{faq.voters.length} bình chọn</Text>}
          </View>
          {status == "indeterminate" ? (
            <Feather name="chevron-right" size={24} color={"black"} />
          ) : (
            <CheckBox label={undefined} status={status} onPress={onPress}/>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(FAQItem);
