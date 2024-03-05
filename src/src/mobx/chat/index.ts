/* eslint-disable prettier/prettier */
import { action, flow, makeAutoObservable } from "mobx";
import { MessageModel, ReplyMessageModel } from "~/models/message";
import uuid from "react-native-uuid";
import MessageServices from "~/services/messages";
import {
  ShortProfileUserModel,
  UserProfileModel,
  USER_PROFILE_SAMPLE,
} from "~/models/user";
import GroupApi from "~/api/remote/GroupApi";
import { GroupModel, GROUP_SAMPLE } from "~/models/group";
import { INIT_TOTAL_REACTION, TotalReaction } from "~/constants/Emoijs";
import { FileModel, StorageMediaAttachemt } from "~/models/media";
import ToolApi from "~/api/remote/ToolApi";
import Helper from "~/utils/Helper";
import { Reaction } from "~/models/reaction";
import { MediaAttachment } from "~/models/media";
import { Vote } from "~/models/vote";
import VoteService from "~/services/vote";
import { Alert } from "react-native";
import { TaskModel, TaskStatusType } from "~/models/task";
import TaskServices from "~/services/task";
import MeetingServices from "~/services/meeting";
import _ from "lodash";
import { FlatList } from "react-native-gesture-handler";
import { MutableRefObject, RefObject, createRef } from "react";

interface Props {
  groupId?: string;
  currentUser: UserProfileModel;
}

export class ChatScreenState {
  // ui/ux state
  isKeyboardVisible = false;
  sendable = false;
  keyboardHeight = 0;
  enableRichToolbar = false;
  initLoading = false;
  loadingMoreMessage = false;
  editing = false;
  replying: ReplyMessageModel | undefined = undefined;
  // data in used
  _currentMessageEditing: MessageModel | undefined;
  _groupDetail: GroupModel = GROUP_SAMPLE;
  _messageList: MessageModel[] = [];
  _currentUser: UserProfileModel = USER_PROFILE_SAMPLE;
  _messageFlatlistRef: RefObject<FlatList<MessageModel>> = createRef();
  _scrollToId = "";
  page = 0;

  constructor() {
    makeAutoObservable(this);
    // this._currentUser = props.currentUser;
    // if (props.groupId) {
    //   this.fetchListMessage(props.groupId);
    //   // this.initGroupData(props.groupId);
    //   // this._messageList = [];
    //   // this.fetchListMessage(props.groupId);
    // }
  }

  @action
  setScrollToId(id: string) {
    this._scrollToId = id;
  }

  @action
  setCurrentUser(currentUser: UserProfileModel) {
    this._currentUser = currentUser;
  }

  @action
  setInitLoading(initLoading: boolean) {
    this.initLoading = initLoading;
  }

  @flow
  setNewGroupDetail(groupDetail: GroupModel) {
    this.setGroupDetail(groupDetail);
  }

  @action
  fetchNewGroup(groupId: string) {
    this.initGroupData(groupId);
    this._messageList = [];
    this.fetchListMessage(groupId);
  }

  @action
  setCurrentMessageEditing(data: MessageModel) {
    this._currentMessageEditing = data;
  }

  @action
  setEditing(status: boolean) {
    this.editing = status;
  }

  @action
  setKeyboardVisible(visibleStatus: boolean) {
    this.isKeyboardVisible = visibleStatus;
  }

  @action
  setKeyboardHeight(height: number) {
    this.keyboardHeight = height;
  }

  @action
  setEnableRichToolbar(status: boolean) {
    this.enableRichToolbar = status;
  }

  @action
  setLoadingMoreMessage(status: boolean) {
    this.loadingMoreMessage = status;
  }

  @action
  sendTextMessage(mess: any) {
    const message: MessageModel = {
      ...mess,
      createdDate: mess.createdDate.toString(),
      groupId: this._groupDetail.id,
      sender: this._currentUser,
      type: "TEXT",
      totalReaction: INIT_TOTAL_REACTION,
      reactions: [],
      reply: this.replying,
    };
    this._messageList = [message, ...this._messageList];
    this.setSendable(false);
    this.setReplying(undefined);
  }

  @action
  receiveMessage(response: any) {
    if (
      (!response.sender.id || response.sender.id == this._currentUser.id) &&
      response.type != "MEETING" &&
      response.type != "TASK" &&
      response.type != "VOTE"
    ) {
      return;
    }

    let task = response.task;
    if (response.type == "TASK") {
      task = TaskServices.fulfillTaskStatus(task, this._currentUser.id);
    }

    let meeting = response.meeting;
    if (response.type == "MEETING") {
      meeting = MeetingServices.fulfillMeetingTime(response.meeting);
    }

    const mess: MessageModel = {
      ...response,
      id: response.id,
      content: response.content,
      createdDate: new Date(response.createdDate).toString(),
      groupId: this._groupDetail.id,
      sender: response.sender,
      type: response.type,
      images: response.images,
      totalReaction: INIT_TOTAL_REACTION,
      reactions: [],
      task: task,
      meeting: meeting,
      reply: response.reply,
    };
    this._messageList = [mess, ...this._messageList];
  }

  @action
  setTotalReaction(src: TotalReaction, messageId: string) {
    const newMessageList = this._messageList.map(item => {
      if (item.id == messageId) {
        const newItem: MessageModel = {
          ...item,
          totalReaction: src,
        };

        return newItem;
      }
      return item;
    });

    this.setMessageList(newMessageList);
  }

  @action
  setReactions(src: Reaction[], messageId: string) {
    const newMessageList = this._messageList.map(item => {
      if (item.id == messageId) {
        const newItem: MessageModel = {
          ...item,
          reactions: src,
        };

        return newItem;
      }
      return item;
    });

    this.setMessageList(newMessageList);
  }

  @action
  receiveReact(response: any) {
    if (response.senderId == this._currentUser.id) {
      return;
    }

    const newMessageList = this._messageList.map(item => {
      if (item.id != response.messageId) {
        return item;
      }

      const isOwnReaction = response.senderId == this._currentUser.id;
      return {
        ...item,
        totalReaction: Helper.addEmoji(
          item.totalReaction,
          response.emojiId,
          isOwnReaction,
        ),
        reactions: Helper.addUserEmoji(item.reactions, response.emojiId, {
          id: response.senderId,
          ...response,
        } as ShortProfileUserModel),
      } as MessageModel;
    });

    this.setMessageList(newMessageList);
  }

  @action
  receiveRemoveReact(response: any) {
    if (response.senderId == this._currentUser.id) {
      return;
    }

    const newMessageList = this._messageList.map(item => {
      if (item.id == response.messageId) {
        return {
          ...item,
          totalReaction: {
            ...item.totalReaction,
            data: response.totalReaction.data,
            total: response.totalReaction.total,
          },
          reactions: Helper.removeUserEmoji(item.reactions, {
            id: response.senderId,
            ...response,
          }),
        };
      }
      return item as MessageModel;
    });

    this.setMessageList(newMessageList);
  }

  @action
  addSelectedImage(
    selectedMedia: StorageMediaAttachemt[],
    sender: ShortProfileUserModel,
  ) {
    const mess: MessageModel = {
      id: `${uuid.v4().toString()}`,
      content: "",
      createdDate: new Date().toString(),
      groupId: this._groupDetail.id,
      sender: sender,
      type: "IMAGE",
      totalReaction: INIT_TOTAL_REACTION,
      images: selectedMedia.map(item => {
        return { type: "IMAGE", url: item.path, isLoading: true };
      }),
      reactions: [],
    };
    this._messageList = [mess, ...this._messageList];
    this.uploadImages(mess.id || "", selectedMedia);
  }

  @action
  addSeleledFile(item: MediaAttachment, sender: ShortProfileUserModel) {
    const date = new Date();
    const mess: MessageModel = {
      id: `${uuid.v4().toString()}`,
      content: "",
      createdDate: date.toString(),
      groupId: this._groupDetail.id,
      sender: sender,
      type: "FILE",
      totalReaction: INIT_TOTAL_REACTION,
      file: { ...item, url: item.path, uploadStatus: "Uploading" },
      reactions: [],
    };
    this._messageList = [mess, ...this._messageList];
    this.uploadFile(mess.id || "", item);
  }

  @action
  addVote(data: Vote) {
    const newMessageList: MessageModel[] = this._messageList.map(message => {
      const vote: Vote | undefined = message.vote;
      if (!vote) {
        return message;
      }
      if (vote.id != data.id) {
        return message;
      }
      return {
        ...message,
        vote: VoteService.sortChoiceVotes(data),
      };
    });
    this.setMessageList(newMessageList);
  }

  @action
  updateVote(voteId: string, status: "OPEN" | "CLOSED") {
    const newMessageList: MessageModel[] = this._messageList.map(message => {
      const vote: Vote | undefined = message.vote;
      if (!vote) {
        return message;
      }
      if (vote.id != voteId) {
        return message;
      }

      return {
        ...message,
        vote: {
          ...vote,
          status: status,
        },
      };
    });
    this.setMessageList(newMessageList);
  }

  @action
  updateTaskStatus(taskId: string, newStatus: TaskStatusType) {
    const newMessageList: MessageModel[] = this._messageList.map(message => {
      const task: TaskModel | undefined = message.task;
      if (!task) {
        return message;
      }

      if (task.id != taskId) {
        return message;
      }

      return {
        ...message,
        task: {
          ...task,
          status: newStatus,
          assignees: task.assignees.map(assignee => {
            if (assignee.id != this._currentUser.id) {
              return assignee;
            }
            return {
              ...assignee,
              status: newStatus,
            };
          }),
        },
      };
    });
    this.setMessageList(newMessageList);
  }

  @action
  setSendable(value: boolean) {
    this.sendable = value;
  }

  @action
  setMessageList(data: MessageModel[]) {
    this._messageList = data;
  }

  @action
  setGroupDetail(data: GroupModel) {
    this._groupDetail = data;
  }

  @action
  getMoreMessage() {
    this.fetchListMessage(this._groupDetail.id);
  }

  @action
  setPage(value: number) {
    this.page = value;
  }

  @action
  deleteMessage(messageId: string) {
    const newMessageList: MessageModel[] = this._messageList.map(item => {
      if (item.id == messageId) {
        return {
          ...item,
          status: "DELETED",
        } as MessageModel;
      }
      return item;
    });
    this.setMessageList(newMessageList);

    const newPinnedMessages = this._groupDetail.pinnedMessages?.filter(
      message => message.id != messageId,
    );
    this.setGroupDetail({
      ...this._groupDetail,
      pinnedMessages: newPinnedMessages,
    } as GroupModel);
  }

  @action
  updateMessage(messageId: string, newContent: string) {
    const newMessageList: MessageModel[] = this._messageList.map(item => {
      if (item.id === messageId) {
        return {
          ...item,
          status: "EDITED",
          content: newContent,
        } as MessageModel;
      }
      if (item.reply && item.reply.id == messageId) {
        return {
          ...item,
          reply: { ...item.reply, content: newContent },
        };
      }
      return item;
    });

    this.setMessageList(newMessageList);
  }

  @action
  getMessageById(id: string) {
    for (let i = 0; i < this._messageList.length; ++i) {
      if (this._messageList[i].id === id) {
        return this._messageList[id];
      }
    }
  }

  @action
  async addPinnedMessage(message: MessageModel): Promise<boolean> {
    await this.getPinnedMessages(this._groupDetail.id);

    const pinnedMessages: MessageModel[] = this._groupDetail.pinnedMessages
      ? this._groupDetail.pinnedMessages
      : [];

    const index = pinnedMessages.findIndex(item => item.id === message.id);

    if (index > -1) {
      Alert.alert("Thông báo", "Tin nhắn này đã được ghim!");
      return false;
    }

    if (pinnedMessages.length === 5) {
      Alert.alert("Thông báo", "Bạn chỉ có thể ghim tối đa 5 tin nhắn!");
      return false;
    }

    const newGroupData: GroupModel = {
      ...this._groupDetail,
      pinnedMessages: [message, ...pinnedMessages],
    };
    this.setGroupDetail(newGroupData);
    return true;
  }

  @action
  removePinnedMessage(messageId: string) {
    if (!this._groupDetail.pinnedMessages) {
      return;
    }
    const pinnedMessages: MessageModel[] =
      this._groupDetail.pinnedMessages.filter(item => item.id != messageId);

    const newGroupData: GroupModel = {
      ...this._groupDetail,
      pinnedMessages: [...pinnedMessages],
    };
    this.setGroupDetail(newGroupData);
  }

  @action
  setReplying(mess: ReplyMessageModel | undefined) {
    this.replying = mess;
  }

  @flow
  async fetchListMessage(groupId: string, size = 25) {
    if (this.page < 0) {
      this.setLoadingMoreMessage(false);
      this.setInitLoading(false);
      this.setPage(-1);
      return;
    }

    console.log("@FETCH LIST MESSAGE", this.page);

    const data = await MessageServices.getMessages(
      this._currentUser.id,
      groupId,
      this.page,
      size,
    );

    if (data && data.length > 0) {
      this.setPage(this.page + 1);
      const newList = [...this._messageList, ...data];
      if (this._messageList && this._messageList.length < 15) {
        const n = _.uniqWith(newList, (a, b) => a.id === b.id);
        this.setMessageList(n);
        this.setInitLoading(false);
      } else {
        this.setMessageList(newList);
      }
    } else {
      this.setPage(-1);
    }

    this.setLoadingMoreMessage(false);
    this.setInitLoading(false);
  }

  @flow
  private async initGroupData(groupId: string) {
    try {
      const data = await GroupApi.findById(groupId);
      this.setGroupDetail(data);
    } catch (error) {}
  }

  @flow
  private async uploadImages(
    messageId: string,
    images: StorageMediaAttachemt[],
  ) {
    try {
      const uploaded: boolean = await ToolApi.uploadMessageImages(
        messageId,
        images,
        this._groupDetail.id,
        this._currentUser.id,
      );

      const newMessageList: MessageModel[] = this._messageList.map(item => {
        if (item.id === messageId) {
          return {
            ...item,
            uploadFailed: !uploaded,
            images: item.images?.map(
              img =>
                ({
                  ...img,
                  isLoading: false,
                } as Social.MediaItem),
            ),
          };
        }
        return item;
      });
      this.setMessageList(newMessageList);
    } catch (error) {}
  }

  @flow
  private async uploadFile(messageId: string, file: MediaAttachment) {
    try {
      const newUrl = await ToolApi.uploadMessageFile(
        messageId,
        file,
        this._groupDetail.id,
        this._currentUser.id,
      );

      const newMessageList: MessageModel[] = this._messageList.map(item => {
        if (item.id === messageId) {
          return {
            ...item,
            file: {
              ...item.file,
              url: newUrl,
              filename: file.filename,
              uploadStatus: newUrl ? "Success" : "Fail",
            } as FileModel,
          };
        }
        return item;
      });
      this.setMessageList(newMessageList);
    } catch (error) {
      console.log("@ERROR Upload file failed");
    }
  }
  @flow
  private async getPinnedMessages(groupId: string) {
    try {
      const pinnedMessages = await GroupApi.getPinnedMessages(groupId);
      this.setGroupDetail({ ...this._groupDetail, pinnedMessages });
    } catch (error) {}
  }
}
