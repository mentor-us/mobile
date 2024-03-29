import React, { createContext, useContext } from "react";
import { ChatScreenState } from "@mobx/chat";
import { useMobxStore } from "~/mobx/store";

const ChatScreenContext = createContext<ChatScreenState | undefined>(undefined);

interface Props {
  children: React.ReactElement;
  state: ChatScreenState;
}

/** Wrap context for global search */
const ChatScreenProvider: React.FC<Props> = props => {
  return (
    <ChatScreenContext.Provider value={props.state}>
      {props.children}
    </ChatScreenContext.Provider>
  );
};

export default ChatScreenProvider;

export const useChatScreenState = (): ChatScreenState => {
  // const state = useContext(ChatScreenContext);
  const { chatState: state } = useMobxStore();

  return state as ChatScreenState;
};
