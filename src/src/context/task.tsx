import React, { createContext, useContext } from "react";
import { CreateTaskScreenState } from "~/mobx/task";

interface Props {
  children: React.ReactElement;
  state: CreateTaskScreenState;
}

const Context = createContext<CreateTaskScreenState | undefined>(undefined);

const CreateTaskScreenProvider: React.FC<Props> = props => {
  return (
    <Context.Provider value={props.state}>{props.children}</Context.Provider>
  );
};

export default CreateTaskScreenProvider;

export const useCreateTaskScreenState = () => {
  const state = useContext(Context);
  return state as CreateTaskScreenState;
};
