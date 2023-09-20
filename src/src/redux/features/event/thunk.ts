import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { event } from "react-native-reanimated";
import {EventScreenState, ScheduleModel} from "~/models/schedule";
import ScheduleServices from "~/services/schedule";
import Helper from "~/utils/Helper";

const fetchEvent = createAsyncThunk(
  "@event/fetchEvent",
  async (): Promise<ScheduleModel[]> => {
    const data = await ScheduleServices.getScheduleData();
    return data;
  },
);

export const EventExtraReducer = (
  builder: ActionReducerMapBuilder<EventScreenState>,
) => {
  builder.addCase(
    fetchEvent.fulfilled,
    (state, action: PayloadAction<ScheduleModel[]>) => {
      state.events = action.payload;
      state.markedDates = Helper.mapEventToMarkedDate(action.payload);
      state.loading = false;
    },
  );
};

const EventThunk = {
  fetchEvent,
};

export default EventThunk;
