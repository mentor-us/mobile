import React, {createContext, useContext} from "react";
import {CreateMeetingScreenState} from "~/mobx/meeting";

interface Props {
  children: React.ReactElement;
  state: CreateMeetingScreenState;
}

const Context = createContext<CreateMeetingScreenState | undefined>(undefined);

const CreateMeetingScreenProvider: React.FC<Props> = props => {
  return (
    <Context.Provider value={props.state}>{props.children}</Context.Provider>
  );
};

export default CreateMeetingScreenProvider;

export const useCreateMeetingScreenState = () => {
  const state = useContext(Context);
  return state as CreateMeetingScreenState;
};
