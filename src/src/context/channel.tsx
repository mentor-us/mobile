import React, {createContext, useContext} from "react";
import { AddChannelScreenState } from "~/mobx/channel";

interface Props {
  children: React.ReactElement;
  state: AddChannelScreenState;
}

const Context = createContext<AddChannelScreenState | undefined>(undefined);

const AddChannelScreenProvider: React.FC<Props> = props => {
  return (
    <Context.Provider value={props.state}>{props.children}</Context.Provider>
  );
};

export default AddChannelScreenProvider;

export const useAddChannelScreenState = () => {
  const state = useContext(Context);
  return state as AddChannelScreenState;
};
