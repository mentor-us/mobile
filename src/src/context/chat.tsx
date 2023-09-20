import React, {createContext, useContext} from "react";
import {ChatScreenState} from "@mobx/chat";

const context = createContext<ChatScreenState | undefined>(undefined);

interface Props {
  children: React.ReactElement;
  state: ChatScreenState;
}

/** Wrap context for global search */
const ChatScreenProvider: React.FC<Props> = props => {
  return (
    <context.Provider value={props.state}>{props.children}</context.Provider>
  );
};

export default ChatScreenProvider;
export const useChatScreenState = () => {
  const state = useContext(context);

  return state as ChatScreenState;
};
