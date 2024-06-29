import React, { createContext, useContext } from "react";

interface AppState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AppContext = createContext<AppState>({
  isLoading: false,
  setIsLoading: () => {},
});

interface Props {
  children: React.ReactElement;
}

/** Wrap context for global search */
const AppProvider: React.FC<Props> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppState = (): AppState => {
  const state = useContext(AppContext);

  return state as AppState;
};
