import {
  DeviceEventEmitter,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import styles from "./styles";

import {Actions, TabType} from "../index.props";
import ListItem from "./ListItem";
import SizedBox from "~/components/SizedBox";
import {useCallback, useEffect, useState} from "react";
import {ChoiceDetail, Vote, VoteDetail} from "~/models/vote";
import VotingApi from "~/api/remote/VotingApi";
import EventEmitterNames from "~/constants/EventEmitterNames";
import {Button, FAB, Snackbar} from "react-native-paper";
import {useAppSelector} from "~/redux";
import {ShortProfileUserModel} from "~/models/user";
import VoteService from "~/services/vote";
import {useNavigation} from "@react-navigation/native";
import {Color} from "~/constants/Color";
import {FloatingAction} from "react-native-floating-action";

interface Props {
  groupId: string;
  type: TabType;
}

export default function CustomTabView({groupId, type}: Props) {
  const navigation = useNavigation();
  const currentUser = useAppSelector(state => state.user.data);

  const [groupVotes, setGroupVotes] = useState<VoteDetail[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  const _renderItem = ({item, index}) => {
    return <ListItem type={type} item={item} />;
  };

  const onRefresh = useCallback(() => setRefreshing(true), []);

  const fetchData = async () => {
    switch (type) {
      case "voting":
        const response = await VotingApi.getGroupVotes(groupId);
        setGroupVotes(response);
        break;
      case "note":
        break;
      default:
        break;
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);

  const addNewVoting = (newVoting: Vote) => {
    const updatedVote: VoteDetail | undefined = groupVotes.find(
      vote => vote.id === newVoting.id,
    );

    if (!updatedVote) {
      return;
    }

    const oldChoices: ChoiceDetail[] = updatedVote.choices;
    let newChoices: ChoiceDetail[] = [];
    newVoting.choices.forEach(newChoice => {
      const oldChoice = oldChoices.find(choice => choice.id == newChoice.id);
      const isSelected: boolean = newChoice.voters.includes(currentUser.id);
      if (!oldChoice) {
        newChoices.push({
          id: newChoice.id,
          name: newChoice.name,
          voters: !isSelected
            ? []
            : [
                {
                  id: currentUser.id,
                  name: currentUser.name,
                  imageUrl: currentUser.imageUrl,
                },
              ],
        } as ChoiceDetail);
        return;
      }

      const newVoters = oldChoice.voters.filter(
        choice => choice.id != currentUser.id,
      );
      const choice = {
        ...oldChoice,
        voters: !isSelected
          ? newVoters
          : [
              ...newVoters,
              {
                id: currentUser.id,
                name: currentUser.name,
                imageUrl: currentUser.imageUrl,
              } as ShortProfileUserModel,
            ],
      };
      newChoices.push(choice);
    });

    const newVotes = groupVotes.map(vote => {
      if (vote.id != updatedVote.id) {
        return vote;
      }

      const newVote: VoteDetail = {
        ...vote,
        choices: newChoices,
      } as VoteDetail;
      return VoteService.sortChoiceVoteDetails(newVote);
    });
    setGroupVotes(newVotes);
  };

  const updateVoting = (voteId, status) => {
    setGroupVotes(groupVotes.map(vote => {
      if (vote.id != voteId) {
        return vote;
      }
      return {
        ...vote,
        status: status
      } as VoteDetail;
    }));
  };

  useEffect(() => {
    const createVoting = DeviceEventEmitter.addListener(
      EventEmitterNames.createVoting,
      (newVoting: VoteDetail) => {
        if (type == "voting") {
          setTimeout(() => {
            setGroupVotes(prev => [newVoting, ...prev]);
            setMessage("Tạo bình chọn thành công.");
            setSnackBar(true);
          }, 1000);
        }
      },
    );

    const addVoting = DeviceEventEmitter.addListener(
      EventEmitterNames.addVoting,
      (newVoting: Vote) => {
        if (type == "voting") {
          addNewVoting(newVoting);
        }
      },
    );

    const updateVote = DeviceEventEmitter.addListener(
      EventEmitterNames.updateVoting,
      (data: any) => {
        if (type == "voting") {
          updateVoting(data.voteId, data.status);
        }
      }
    );

    return () => {
      createVoting.remove();
      addVoting.remove();
      updateVote.remove();
    };
  }, [groupVotes]);

  const onCreateVoting = () => {
    navigation.navigate("createVoting", {groupId: groupId});
  };

  const _ListEmptyComponent = () => {
    if (type == "note" || type == "pin" || refreshing) {
      return <></>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nhóm chưa có bình chọn nào</Text>

        <View style={styles.emptyBtn}>
          <Button
            onPress={onCreateVoting}
            mode="contained"
            icon="playlist-plus"
            color={Color.primary}>
            Tạo bình chọn
          </Button>
        </View>
      </View>
    );
  };

  const onAdd = () => {
    switch (type) {
      case "voting":
        navigation.navigate("createVoting", {
          groupId: groupId,
        });
        break;
      case "note":
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={type == "voting" ? groupVotes : []}
        keyExtractor={item => `${item.id}`}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <SizedBox height={4} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={_ListEmptyComponent}
      />

      {/* <FloatingAction
        actions={Actions}
        onPressItem={onAdd}
        color={Color.primary}
        tintColor={Color.transparent}
        animated={true}
      /> */}
      <FAB icon={"plus"} style={styles.floatingButtonImage} onPress={onAdd} />
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
}
