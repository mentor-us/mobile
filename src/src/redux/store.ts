import {configureStore} from "@reduxjs/toolkit";
import rootReducer, {combinedReducer} from "./root_reducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
