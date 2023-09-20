import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";
import FaqApi from "~/api/remote/FaqApi";
import {Color} from "~/constants/Color";
import {useState} from "react";
import {FaqModel} from "~/models/faq";
import {ScreenProps} from "~/types/navigation";
import SizedBox from "~/components/SizedBox";
import {FaqIcon, FaqAnswerIcon} from "~/assets/svgs";
import EventEmitterNames from "~/constants/EventEmitterNames";
import {Snackbar} from "react-native-paper";

const CreateFaq: ScreenProps<"createFaq"> = ({route}) => {
  const navigation = useNavigation();
  const groupId = route.params.groupId;

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => setSnackBar(false);

  const onSubmit = async () => {
    const data = {
      question: question,
      answer: answer,
      groupId: groupId,
    };

    const isCreated = await FaqApi.createFaq(data);
    if (!isCreated) {
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại!");
      setSnackBar(true);
      return;
    }
    DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
      status: true,
      message: "Tạo FAQ thành công",
    });
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[styles.container, {backgroundColor: Color.white, padding: 15}]}>
        <View style={styles.fieldContainer}>
          <View>
            <SizedBox height={16} />
            <FaqIcon />
          </View>
          <SizedBox width={16} />
          <View style={styles.textCtn}>
            <Text style={styles.fieldName}>Câu hỏi</Text>
            <TextInput
              placeholder="Nhập nội dung câu hỏi"
              placeholderTextColor={Color.text[4]}
              style={styles.questionInput}
              value={question}
              multiline
              numberOfLines={2}
              onChangeText={text => {
                setQuestion(text);
              }}
            />
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <View>
            <SizedBox height={16} />
            <FaqAnswerIcon height={22} />
          </View>
          <SizedBox width={16} />
          <View style={styles.textCtn}>
            <Text style={styles.fieldName}>Câu trả lời</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="Nhập nội dung câu trả lời"
              placeholderTextColor={Color.text[4]}
              value={answer}
              onChangeText={text => {
                setAnswer(text);
              }}
              multiline
              numberOfLines={10}
            />
          </View>
        </View>

        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "flex-start"}}>
          <TouchableOpacity style={styles.btn} onPress={onSubmit}>
            <Text style={styles.textBtn}>Tạo câu hỏi</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1000}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default CreateFaq;
