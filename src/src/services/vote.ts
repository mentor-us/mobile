import VotingApi from "~/api/remote/VotingApi";
import {ShortGroupModel} from "~/models/group";
import {ShortProfileUserModel, UserProfileModel} from "~/models/user";
import {
  Choice,
  ChoiceDetail,
  ChoiceResult,
  EMPTY_VOTE_DETAIL,
  EMPTY_VOTE_RESULT,
  NEW_VOTE_SAMPLE,
  Vote,
  VoteDetail,
  VoteResult,
} from "~/models/vote";
import {useAppSelector} from "~/redux";
import VotingDetail from "~/screens/Groups/VotingDetail";

const VoteService = {
  getVotingDetail: async (
    voteId: string,
    userId: string,
  ): Promise<VoteResult> => {
    try {
      const data: VoteDetail = await VotingApi.getVotingDetail(voteId);
      if (data) {
        return {
          ...data,
          choiceResult: data.choices.map(choice => {
            const voterIds = choice.voters.flatMap(voter => voter.id);
            return {
              ...choice,
              status: voterIds.includes(userId) ? "checked" : "unchecked",
            } as ChoiceResult;
          }),
        };
      }
      return EMPTY_VOTE_RESULT;
    } catch (error) {
      return EMPTY_VOTE_RESULT;
    }
  },

  createVoting: async (
    currentUser: UserProfileModel,
    data: any,
  ): Promise<VoteDetail> => {
    try {
      const response: Vote = await VotingApi.createVoting(data);
      if (!response) {
        return response;
      }
      return {
        id: response.id,
        question: response.question,
        choices: response.choices.map(choice => {
          return {id: choice.id, name: choice.name, voters: []} as ChoiceDetail;
        }),
        groupId: response.groupId,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          imageUrl: currentUser.imageUrl,
        } as ShortProfileUserModel,
        timeEnd: response.timeEnd,
        createdDate: response.createdDate,
        status: response.status,
        closedDate: response.closedDate,
      } as VoteDetail;
    } catch (error) {
      return EMPTY_VOTE_DETAIL;
    }
  },

  doVoting: async (vote: VoteResult, userId: string): Promise<Vote> => {
    try {
      const finalChoices: Choice[] = vote.choiceResult.map(choice => {
        const voterIds: string[] = choice.voters
          .flatMap(voter => voter.id)
          .filter(voterId => voterId != userId);
        return {
          ...choice,
          voters: choice.status == "checked" ? [...voterIds, userId] : voterIds,
        } as Choice;
      });

      const doVotingRequest: any = {
        voterId: userId,
        voteId: vote.id,
        choices: finalChoices,
      };
      await VotingApi.doVoting(vote.id, doVotingRequest);

      return {
        id: vote.id,
        creatorId: vote.id,
        createdDate: vote.createdDate,
        question: vote.question,
        choices: finalChoices,
        groupId: vote.groupId,
        timeEnd: vote.timeEnd,
        status: vote.status,
        closedDate: vote.closedDate,
      } as Vote;
    } catch (error) {
      return NEW_VOTE_SAMPLE;
    }
  },

  sortChoiceVotes: (vote: Vote): Vote => {
    const newChoices = [...vote.choices].sort((firstChoice, secondChoice) => {
      return secondChoice.voters.length - firstChoice.voters.length;
    });

    return {
      ...vote,
      choices: newChoices,
    } as Vote;
  },

  sortChoiceVoteDetails: (vote: VoteDetail): VoteDetail => {
    const newChoices = [...vote.choices].sort((firstChoice, secondChoice) => {
      return secondChoice.voters.length - firstChoice.voters.length;
    });

    return {
      ...vote,
      choices: newChoices,
    } as VoteDetail;
  },
};

export default VoteService;
