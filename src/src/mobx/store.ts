import { createContext, useContext } from "react";
import AuthStore from "./auth";
import { ChatScreenState } from "./chat";

export const rootMobxStore = {
  authStore: new AuthStore(),
  chatState: new ChatScreenState(),
};

export type TRootMobxStore = typeof rootMobxStore;
const RootMobxStoreContext = createContext<null | TRootMobxStore>(null);

export const MobxProvider = RootMobxStoreContext.Provider;

export function useMobxStore() {
  const store = useContext(RootMobxStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
