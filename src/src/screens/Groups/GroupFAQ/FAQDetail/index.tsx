import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  DeviceEventEmitter,
  RefreshControl,
  TouchableOpacity,
  Alert,
  AlertButton,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles";
import GlobalStyles from "~/constants/GlobalStyles";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";
import { FaqIcon, FaqAnswerIcon } from "~/assets/svgs";
import { FaqModel, FAQ_SAMPLE } from "~/models/faq";
import FaqApi from "~/api/remote/FaqApi";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import { Color } from "~/constants/Color";
import Helper from "~/utils/Helper";
import { color } from "react-native-reanimated";
import { RoleType } from "~/models/commonTypes";

const FaqDetail: ScreenProps<"faqDetail"> = ({ route }) => {
  const navigation = useNavigation();
  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);
  const faqId = route.params.faqId;

  /* State */
  const [faqData, setFaqData] = useState<FaqModel>(FAQ_SAMPLE);
  const editable: boolean = useMemo(() => {
    return faqData.group.role === RoleType.MENTOR ? true : false;
  }, [faqData]);

  /* Form state */
  const [question, setQuestion] = useState<string>(faqData.question);
  const [answer, setAnswer] = useState<string>(faqData.answer);
  const [questionError, setQuestionError] = useState<string>("");
  const [answerError, setAnswerError] = useState<string>("");

  /* UI state */
  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => setSnackBar(false);

  const resetForm = () => {
    setQuestionError("");
    setAnswerError("");
  };

  const validateForm = () => {
    resetForm();

    let isFailed = false;
    if (question == "") {
      setQuestionError("Không được để trống.");
      isFailed = true;
    }

    if (answer == "") {
      setAnswerError("Không được để trống.");
      isFailed = true;
    }

    return isFailed;
  };

  const onUpdateFaq = async () => {
    if (validateForm()) {
      return;
    }

    if (question == faqData.question && answer == faqData.answer) {
      setMessage("Vui lòng thay đổi nội dung.");
      setSnackBar(true);
      return;
    }

    const isUpdated = await FaqApi.updateFaq(faqId, {
      question: question,
      answer: answer,
      groupId: faqData.group.id,
    });
    if (!isUpdated) {
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      setSnackBar(true);
      return;
    }

    setLoading(true);
    setMessage("Cập nhật FAQ thành công!");
    setSnackBar(true);

    setTimeout(() => {
      DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
        status: true,
        message: "Cập nhật FAQ thành công!",
      });
    });
  };

  const deleteFaq = async () => {
    Alert.alert("Cảnh báo", "Bạn có chắc muốn xóa FAQ này?", [
      { text: "Hủy" },
      {
        text: "Xác nhận",
        onPress: async () => {
          if (!faqData.id) {
            return;
          }
          const isDeleted = await FaqApi.deleteFaq(faqId);
          if (!isDeleted) {
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
            setSnackBar(true);
            return;
          }
          DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
            status: true,
            message: "Xóa FAQ thành công",
          });

          navigation.goBack();
        },
      },
    ] as AlertButton[]);
  };

  const upvote = async () => {
    const isSuccess = await FaqApi.upvoteFaq(faqId);
    if (!isSuccess) {
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      setSnackBar(true);
      return;
    }

    setMessage("Gửi phản hồi thành công!");
    setSnackBar(true);

    setTimeout(() => {
      DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
        status: true,
        message: "Gửi phản hồi thành công!",
      });
    }, 500);
  };

  const downVote = async () => {
    const isSuccess = await FaqApi.downVote(faqId);
    if (!isSuccess) {
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      setSnackBar(true);
      return;
    }

    setMessage("Gửi phản hồi thành công!");
    setSnackBar(true);

    setTimeout(() => {
      DeviceEventEmitter.emit(EventEmitterNames.refreshFAQList, {
        status: true,
        message: "",
      });
    }, 500);
  };

  // call api
  const fetchFaqData = async (faqId: string) => {
    try {
      const data = await FaqApi.getFaqDetail(faqId);

      // Set state
      setFaqData(data);
      setQuestion(data.question);
      setAnswer(data.answer);

      // UI loading
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_ERROR_FaqDetail_: ", error);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchFaqData(faqId);
    }
  }, [faqId, loading]);

  if (!faqData) {
    if (loading) {
      return (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={GlobalStyles.fullFlexFocus}>
        <Text style={{ color: Color.black }}>
          FAQ này không tồn tại hoặc đã bị xóa
        </Text>
      </SafeAreaView>
    );
  }

  const onRefresh = () => {
    setLoading(true);
    resetForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        style={[GlobalStyles.fullFlex, { padding: 15 }]}
        bounces={false}>
        <View
          style={[
            styles.fieldContainer,
            {
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 20,
            },
          ]}>
          <Text style={styles.groupTitle}>Nhóm: {faqData.group.name}</Text>
          <Text style={styles.categoryTitle}>
            Tạo bởi {faqData.creator.name} -{" "}
            {Helper.getTime(faqData.createdDate.toString())}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.fieldContainer}>
          <View style={styles.questionCtn}>
            <Text style={styles.fieldName}>Câu hỏi</Text>
            <TextInput
              placeholder="Nhập nội dung câu hỏi"
              style={styles.questionInput}
              value={question}
              onChangeText={text => {
                setQuestion(text);
              }}
              multiline
              numberOfLines={3}
              editable={editable}
            />
            {questionError && (
              <Text style={styles.errorText}>{questionError}</Text>
            )}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.icon}>
            <FaqAnswerIcon height={22} />
          </View>

          <View style={styles.answerCtn}>
            <Text style={styles.fieldName}>Câu trả lời</Text>
            <TextInput
              style={styles.answerInput}
              placeholder="Nhập nội dung câu trả lời"
              value={answer}
              onChangeText={text => {
                setAnswer(text);
              }}
              multiline
              numberOfLines={8}
              editable={editable}
            />
            {answerError && <Text style={styles.errorText}>{answerError}</Text>}
          </View>
        </View>

        {editable && (
          <View>
            <Text style={styles.hint}>* Cho phép chỉnh sửa trực tiếp</Text>
            <TouchableOpacity style={styles.btn} onPress={onUpdateFaq}>
              <Text style={styles.textBtn}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        )}

        {!editable && (
          <View style={styles.voteCtn}>
            <Text style={styles.voteText}>
              Thông tin này có hữu ích cho bạn không?
            </Text>
            <View style={styles.btnGroup}>
              <Button
                onPress={upvote}
                mode="contained"
                icon={"account-check"}
                uppercase={false}
                color={Color.green}>
                Có
              </Button>
              <Button
                onPress={downVote}
                mode="contained"
                icon={"account-cancel"}
                uppercase={false}
                color={Color.red}>
                Không
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
      {!editable && (
        <TouchableOpacity style={styles.deleteBtn} onPress={goBack}>
          <Text style={styles.sureBtn}>Đã hiểu</Text>
        </TouchableOpacity>
      )}
      {editable && (
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteFaq}>
          <Text style={styles.deleteText}>Xóa câu hỏi</Text>
        </TouchableOpacity>
      )}
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default FaqDetail;
