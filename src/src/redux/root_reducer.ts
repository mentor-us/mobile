import { combineReducers, Reducer } from "redux";

import userReducer from "./features/user/slice";
import { RootState } from "./store";
import authReducer from "./features/auth/slice";
import eventReducer from "./features/event/slice";

export const combinedReducer = combineReducers({
  /** @deprecated */
  auth: authReducer,
  user: userReducer,
  event: eventReducer,
});

const rootReducer: Reducer<RootState> = (state, action) => {
  return combinedReducer(state, action);
};

export default rootReducer;
