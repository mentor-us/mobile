import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  DeviceEventEmitter,
  Keyboard,
} from "react-native";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";
import VotingApi from "~/api/remote/VotingApi";
import {Color} from "~/constants/Color";
import Feather from "react-native-vector-icons/Feather";
import {useState} from "react";
import {useForm, Controller, SubmitErrorHandler} from "react-hook-form";
import {VoteModel, VOTE_SAMPLE} from "~/models/message";
import {ScreenProps} from "~/types/navigation";
import SizedBox from "~/components/SizedBox";
import {
  ClockGrayIcon,
  ClockIcon,
  ClockPrimaryIcon,
  MarkTitleIcon,
  VotingQuestionIcon,
} from "~/assets/svgs";
import MUITextInput from "~/components/MUITextInput";
import {useAppSelector} from "~/redux";
import {UserProfileModel} from "~/models/user";
import {Choice, Vote, VoteDetail} from "~/models/vote";
import uuid from "react-native-uuid";
import DatePicker from "react-native-date-picker";
import Helper from "~/utils/Helper";
import {boolean} from "yup";
import {FAB, Snackbar} from "react-native-paper";
import EventEmitterNames from "~/constants/EventEmitterNames";
import VoteService from "~/services/vote";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";

const CreateVoting: ScreenProps<"createVoting"> = ({route}) => {
  /* Data in need */
  const navigation = useNavigation();
  const currentUser: UserProfileModel = useAppSelector(
    state => state.user.data,
  );
  const groupId = route.params.groupId;
  const queryAction = useUpdateQueryGroupList();

  /* Form state */
  const [question, setQuestion] = useState<string>("");
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [choices, setChoices] = useState<Choice[]>([
    {id: uuid.v4().toString(), name: ""} as Choice,
    {id: uuid.v4().toString(), name: ""} as Choice,
  ]);

  /* Error handling */
  const [errorQuestion, setErrorQuestion] = useState<string>("");
  const [errorTime, setErrorTime] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  /* Choice manipulation */
  const addChoice = () => {
    setChoices([
      ...choices,
      {id: uuid.v4().toString(), name: ""} as Choice,
    ] as Choice[]);
  };

  const removeChoice = (id: string) => {
    setErrors([]);
    if (choices.length == 2) {
      setMessage("Yêu cầu ít nhất 2 lựa chọn.");
      setSnackBar(true);
      return;
    }
    setChoices(choices.filter(choice => choice.id != id));
  };

  const changeQuestion = question => {
    setQuestion(question);
  };

  const changeName = (id, name) => {
    const newChoices: Choice[] = choices.map(choice => {
      if (choice.id != id) {
        return choice;
      }
      return {
        ...choice,
        name: name,
      } as Choice;
    });
    setChoices(newChoices);
  };

  const onSubmit = async () => {
    if (question == "") {
      setErrorQuestion("Không được rỗng");
    } else {
      setErrorQuestion("");
    }
    if (time && time < new Date()) {
      setErrorTime("Chọn thời điểm trong tương lai");
    } else {
      setErrorTime("");
    }
    let hasErrorItems = false;
    const errorItems = choices.map(choice => {
      if (choice.name == "") {
        hasErrorItems = true;
        return "Không được rỗng";
      }
      return "";
    });
    setErrors(errorItems);
    if (errorQuestion != "" || errorTime != "" || hasErrorItems) {
      return;
    }

    const data: any = {
      question: question,
      groupId: groupId,
      creatorId: currentUser.id,
      timeEnd: time,
      choices: choices,
    };
    
    const newVote: VoteDetail = await VoteService.createVoting(currentUser, data);
    
    const newMessage = `Nhóm có cuộc bình chọn mới "${question}"`;
    queryAction.updateGroupNewMessage(groupId, newMessage, false);
    DeviceEventEmitter.emit(EventEmitterNames.createVoting, newVote);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.container,
          {backgroundColor: Color.white, padding: 15, paddingTop: 0},
        ]}>
        <View style={styles.fieldContainer}>
          <View>
            <SizedBox height={16} />
            <VotingQuestionIcon />
          </View>
          <SizedBox width={16} />
          <MUITextInput
            label="Câu hỏi bình chọn *"
            keyboardType={"default"}
            value={question}
            onChangeText={changeQuestion}
            errorText={errorQuestion}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.labelText}>Tuỳ chọn</Text>
        </View>
        <View style={styles.optionItemList}>
          <View style={styles.fieldContainer}>
            <View>
              <SizedBox height={16} />
              <ClockPrimaryIcon width={25} height={25} />
            </View>
            <SizedBox width={16} />
            <MUITextInput
              label={"Thời hạn"}
              value={
                time ? Helper.getTime(time.toString()) : "Không có thời hạn"
              }
              onFocus={() => {
                setOpenDatePicker(true);
              }}
              errorText={errorTime}
              style={{borderBottomColor: Color.primary}}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.labelText}>Các lựa chọn</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.optionItemList}>
          {choices.map((item, index) => {
            return (
              <View style={styles.inputContainer} key={index}>
                <View>
                  <SizedBox height={16} />
                  <MarkTitleIcon width={20} height={20} />
                </View>
                <SizedBox width={16} />
                <View style={styles.fieldInput}>
                  <MUITextInput
                    label={`Lựa chọn ${index + 1}`}
                    keyboardType={"default"}
                    value={item.name}
                    onChangeText={name => changeName(item.id, name)}
                    errorText={errors[index]}
                  />
                </View>
                <FAB
                  icon="close"
                  style={styles.fieldIcon}
                  small
                  onPress={() => removeChoice(item.id)}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.lineSeparator} />

        <TouchableOpacity onPress={addChoice}>
          <View style={styles.plus}>
            <Feather name={"plus"} size={24} color={"#006EDC"} />
            <Text style={{color: "#006EDC"}}>Thêm phương án</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity testID="btn-create-vote" style={styles.btn} onPress={onSubmit}>
          <Text style={styles.textBtn}>Tạo bình chọn</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>

      <DatePicker
        modal
        open={openDatePicker}
        title={"Chọn thời hạn"}
        date={time ? time : new Date()}
        onConfirm={date => {
          const now = new Date();
          if (date < now) {
            Alert.alert(
              "Chọn thời hạn",
              "Vui lòng chọn thời gian trong tương lai!",
              [{text: "Đã hiểu"}]
            );
            setOpenDatePicker(false);
            Keyboard.dismiss();
            return;
          }
          setTime(date);
          setOpenDatePicker(false);
          Keyboard.dismiss();
        }}
        onCancel={() => {
          setTime(undefined);
          setOpenDatePicker(false);
          Keyboard.dismiss();
        }}
        mode={"datetime"}
        locale="vi"
        cancelText="Hủy"
        confirmText="Xác nhận"
      />
    </SafeAreaView>
  );
};

export default CreateVoting;
