import React, {memo, useMemo} from "react";
import {MessageModel} from "~/models/message";
import equals from "react-fast-compare";
import TextContent from "./TextContent";
import Voting from "./Voting";
import Meeting from "./Meeting";
import Helper from "~/utils/Helper";
import {MeetingModel} from "~/models/meeting";
import {TaskModel} from "~/models/task";
import Task from "./Task";
import ImageList from "./ImageList";
import FileItem from "./FileItem";
import System from "./System";
import { useAppSelector } from "~/redux";
import TaskServices from "~/services/task";
import MeetingServices from "~/services/meeting";

interface Props {
  message: MessageModel;
}

const MessageItem = ({message}: Props) => {

  const currentUser = useAppSelector(state => state.user.data);

  if (message.status == "DELETED") {
    return (
      <TextContent
        key={message.id}
        message={{...message, type: "TEXT", content: "Tin nhắn đã được xóa"}}
      />
    );
  }
  switch (message.type) {
    case "TEXT":
      return <TextContent key={message.id} message={message} />;
    case "VOTE":
      return <Voting data={message.vote} />;
    case "MEETING":
      const meeting = MeetingServices.fulfillMeetingTime(message.meeting);
      return <Meeting data={meeting} />;
    case "TASK":
      const task = TaskServices.fulfillTaskStatus(message.task, currentUser.id);
      return <Task data={task} />;
    case "IMAGE":
      return <ImageList message={message} key={message.id} />;
    case "FILE":
      return <FileItem message={message} key={message.id} />;
    case "SYSTEM":
      return <System />;
    default:
      return <TextContent message={message} key={message.id} />;
  }
};

export default memo(MessageItem, equals);
