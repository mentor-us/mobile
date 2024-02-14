import {
  View,
  Text,
  SafeAreaView,
  DeviceEventEmitter,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Color } from "~/constants/Color";
import React, { useCallback, useEffect, useState } from "react";
import EventEmitterNames from "~/constants/EventEmitterNames";
import {
  ChoiceResult,
  EMPTY_VOTE_RESULT,
  NEW_VOTE_SAMPLE,
  Vote,
  VoteDetail,
  VoteResult,
} from "~/models/vote";
import { ScrollView } from "react-native-gesture-handler";
import Helper from "~/utils/Helper";
import MUITextInput from "~/components/MUITextInput";
import uuid from "react-native-uuid";
import Feather from "react-native-vector-icons/Feather";
import { Checkbox, FAB, Snackbar } from "react-native-paper";
import VoteService from "~/services/vote";
import { useAppSelector } from "~/redux";
import { ColumnChartImage, DefaultUserAvatar } from "~/assets/images";
import { LockRedIcon, SortIcon } from "~/assets/svgs";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { StackNavigationOptions } from "@react-navigation/stack";
import HeaderRight from "./HeaderRight";
import VotingApi from "~/api/remote/VotingApi";

const VotingDetail = ({ route }) => {
  /* Data in need */
  const navigation = useNavigation();
  const voteId = route.params.voteId;
  const currentUser = useAppSelector(state => state.user.data);

  /* State */
  const [vote, setVote] = useState<VoteResult>(EMPTY_VOTE_RESULT);
  const [voterNumber, setVoterNumber] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [newChoiceIds, setNewChoiceIds] = useState<any[]>([]);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  /* Error handling */
  const [errors, setErrors] = useState<string[]>([]);

  const goBack = useCallback(() => navigation.goBack(), []);

  const validateForm = () => {
    let hasErrorItems = false;
    const errorItems = vote.choiceResult.map(choice => {
      if (choice.name === "") {
        hasErrorItems = true;
        return "Không được rỗng";
      }
      return "";
    });
    setErrors(errorItems);
    return hasErrorItems;
  };

  const checkUpdatedForm = (newVote: Vote) => {
    if (newChoiceIds.length > 0) {
      return true;
    }

    const oldChoices = vote.choices;
    const newChoices = newVote.choices;

    if (oldChoices.length != newChoices.length) {
      return true;
    }

    let isUpdated: boolean = false;
    oldChoices.forEach(oldChoice => {
      const oldVoterIds = oldChoice.voters.map(voter => voter.id);
      const isSelectedOldChoice = oldVoterIds.includes(currentUser.id);

      const newChoice = newVote.choices.find(
        choice => choice.id == oldChoice.id,
      );
      if (!newChoice) {
        isUpdated = true;
        return;
      }
      const isSelectedNewChoice = newChoice.voters.includes(currentUser.id);

      if (isSelectedOldChoice != isSelectedNewChoice) {
        isUpdated = true;
      }
    });
    return isUpdated;
  };

  const onSave = async () => {
    if (validateForm()) {
      return;
    }

    const sentVote: Vote = await VoteService.doVoting(vote, currentUser.id);
    if (sentVote == NEW_VOTE_SAMPLE) {
      setMessage("Không thể bình chọn. Vui lòng thử lại sau");
      setSnackBar(true);
      return;
    }
    if (checkUpdatedForm(sentVote)) {
      DeviceEventEmitter.emit(EventEmitterNames.addVoting, sentVote);
    }
    goBack();
  };

  const calculateVoterNumber = (voteDetail: VoteDetail) => {
    if (!voteDetail) {
      return 0;
    }
    return voteDetail.choices
      .flatMap(choice => choice.voters)
      .flatMap(voter => voter.id)
      .filter((value, index, array) => array.indexOf(value) === index).length;
  };

  const fetchVoteDetail = async () => {
    const voteDetail: VoteResult = await VoteService.getVotingDetail(
      voteId,
      currentUser.id,
    );
    setVote(voteDetail);
    setVoterNumber(calculateVoterNumber(voteDetail));
    setRefreshing(false);
  };

  useEffect(() => {
    if (refreshing) {
      fetchVoteDetail();
    }
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const addChoice = () => {
    const newId = uuid.v4().toString();
    const newChoices = [
      ...vote.choiceResult,
      { id: newId, name: "", voters: [], status: "unchecked" } as ChoiceResult,
    ];
    setVote({
      ...vote,
      choiceResult: newChoices,
    } as VoteResult);
    setNewChoiceIds([...newChoiceIds, newId]);
  };

  const removeChoice = id => {
    setErrors([]);
    if (!newChoiceIds.includes(id)) {
      return;
    }
    setNewChoiceIds(newChoiceIds.filter(choiceId => choiceId != id));
    setVote({
      ...vote,
      choiceResult: vote.choiceResult.filter(choice => choice.id != id),
    } as VoteResult);
  };

  const changeName = (choiceId: string, name: string) => {
    const newChoices = vote.choiceResult.map(choice => {
      if (choice.id != choiceId) {
        return choice;
      }
      return {
        ...choice,
        name: name,
      } as ChoiceResult;
    });
    setVote({
      ...vote,
      choiceResult: newChoices,
    });
  };

  const pressCheckBox = (choiceId: string) => {
    const newChoices = vote.choiceResult.map(choice => {
      if (choice.id != choiceId) {
        return choice;
      }

      return {
        ...choice,
        status: choice.status == "checked" ? "unchecked" : "checked",
      } as ChoiceResult;
    });
    setVote({
      ...vote,
      choiceResult: newChoices,
    });
  };

  const openChoiceResult = useCallback(
    (choice: ChoiceResult) => {
      BottomSheetModalRef.current?.show("choice_result", {
        choice: choice,
        groupId: vote.groupId,
      });
    },
    [vote.choiceResult],
  );

  const onPressHeaderRight = () => {
    const newStatus = vote.status == "OPEN" ? "CLOSED" : "OPEN";
    const question =
      newStatus == "CLOSED"
        ? "Bạn chắc chắn muốn khoá bình chọn này?"
        : "Bạn muốn mở lại bình chọn này?";
    Alert.alert(
      "Bình chọn",
      question,
      [
        { onPress: async () => changeVoteStatus(newStatus), text: "Đồng ý" },
        { onPress: () => {}, text: "Đóng" },
      ],
      {
        cancelable: true,
      },
    );
  };

  const changeVoteStatus = async (newStatus: "OPEN" | "CLOSED") => {
    let responseMessage = "";
    try {
      switch (newStatus) {
        case "OPEN":
          await VotingApi.reopenVote(voteId);
          responseMessage = "Mở bình chọn thành công.";
          break;
        case "CLOSED":
          await VotingApi.closeVote(voteId);
          responseMessage = "Khoá bình chọn thành công.";
          break;
      }
    } catch (error) {
      responseMessage = "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.";
    }

    setTimeout(() => {
      setRefreshing(true);
      setMessage(responseMessage);
      setSnackBar(true);
    }, 100);

    DeviceEventEmitter.emit(EventEmitterNames.updateVoting, {
      voteId: voteId,
      status: newStatus,
    });
  };

  const headerRight = useCallback(() => {
    if (!vote.canEdit) {
      return <></>;
    }
    return (
      <HeaderRight
        voteId={vote.id}
        status={vote.status}
        changeStatus={onPressHeaderRight}
      />
    );
  }, [vote, refreshing]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    } as StackNavigationOptions);
  }, [vote, refreshing]);

  const VoterThumbnail = ({ voters }) => {
    return voters.slice(0, 3).map(voter => (
      <Image
        key={voter.id}
        source={
          voter.imageUrl &&
          voter.imageUrl !== "https://graph.microsoft.com/v1.0/me/photo/$value"
            ? {
                uri: voter.imageUrl,
              }
            : DefaultUserAvatar
        }
        style={styles.avatar}
      />
    ));
  };

  const formatTime = (src: string): string => {
    const date = new Date(src);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const hh = hours > 9 ? `${hours}` : `0${hours}`;
    const mm = minutes > 9 ? `${minutes}` : `0${minutes}`;

    return `${hh}:${mm}, ${Helper.getMomentTime(src)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Color.primary]}
            tintColor={Color.primary}
          />
        }>
        <View
          style={[
            styles.container,
            { backgroundColor: Color.white, padding: 15 },
          ]}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Image source={ColumnChartImage} style={styles.headerIcon} />
              <Text style={styles.formTitle}>{vote?.question}</Text>
            </View>

            <Text style={styles.info}>
              {vote?.creator.name} -{" Tạo lúc "}
              {vote?.createdDate
                ? formatTime(vote?.createdDate)
                : new Date().toISOString()}
            </Text>
          </View>

          {vote?.status === "OPEN" ? (
            <>
              <View style={styles.headerTitle}>
                <SortIcon />
                <Text style={styles.openTitleText}>
                  Chọn được nhiều lựa chọn
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.headerTitle}>
              <LockRedIcon width={15} height={15} />
              <Text style={styles.lockHeaderTitle}>Đã khoá bình chọn.</Text>
            </View>
          )}

          <View style={styles.lineSeparator} />

          {voterNumber === 0 ? (
            <Text style={styles.hint}>Chưa có người tham gia bình chọn!</Text>
          ) : (
            <Text style={styles.hint}>{voterNumber} người đã bình chọn.</Text>
          )}

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.optionItemList}>
            {vote.choiceResult.map((item, index) => {
              const votePercent = item.voters.length
                ? ((item.voters.length / voterNumber) * 103).toFixed(2) + "%"
                : "0%";

              return (
                <View style={styles.optionItem} key={item.id}>
                  <View
                    style={[
                      styles.percentView,
                      {
                        width: votePercent,
                      },
                    ]}
                  />
                  {/* <MarkTitleIcon width={20} height={20} /> */}
                  <View style={styles.fieldInput}>
                    <View style={styles.checkboxCtn}>
                      <Checkbox
                        onPress={() => pressCheckBox(item.id)}
                        status={item.status}
                        color={Color.primary}
                        disabled={vote.status === "CLOSED"}
                      />
                    </View>

                    {newChoiceIds.includes(item.id) ? (
                      <MUITextInput
                        label={"Lựa chọn mới"}
                        keyboardType={"default"}
                        value={item.name}
                        onChangeText={text => {
                          changeName(item.id, text);
                        }}
                        multiline
                        errorText={errors[index]}
                      />
                    ) : (
                      <Text style={styles.choiceContent}>{item.name}</Text>
                    )}
                  </View>
                  {newChoiceIds.includes(item.id) && (
                    <FAB
                      icon="close"
                      style={styles.fieldIcon}
                      small
                      onPress={() => removeChoice(item.id)}
                    />
                  )}
                  {item.voters.length !== 0 && (
                    <TouchableOpacity
                      style={styles.voterCtn}
                      onPress={() => openChoiceResult(item)}>
                      <VoterThumbnail voters={item.voters} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.lineSeparator} />

          {vote.status === "OPEN" && (
            <TouchableOpacity onPress={addChoice}>
              <View style={styles.plus}>
                <Feather name={"plus"} size={24} color={"#006EDC"} />
                <Text style={{ color: "#006EDC" }}>Thêm phương án</Text>
              </View>
            </TouchableOpacity>
          )}

          {vote.status === "OPEN" ? (
            <TouchableOpacity style={styles.btn} onPress={onSave}>
              <Text numberOfLines={1} style={styles.textBtn}>
                Bình chọn
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.endBtn}>
              <Text numberOfLines={1} style={styles.endTextBtn}>
                Bình chọn đã kết thúc
              </Text>
            </View>
          )}
        </View>

        <Snackbar
          visible={snackBar}
          onDismiss={onDismissSnackBar}
          duration={1500}>
          {message}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VotingDetail;
