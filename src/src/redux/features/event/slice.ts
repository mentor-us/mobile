import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {CalendarMode, EventScreenState, MyMarkedDate} from "~/models/schedule";
import {EventExtraReducer} from "./thunk";
import Helper from "~/utils/Helper";

const INITIAL_STATE: EventScreenState = {
  calendarMode: "week",
  enableMonthSlider: false,
  month: new Date().getMonth() + 1,
  events: [],
  loading: true,
  markedDates: {},
};

const eventSlice = createSlice({
  name: "@Event",
  initialState: INITIAL_STATE,
  reducers: {
    updateCalendarMode: (
      state: EventScreenState,
      action: PayloadAction<CalendarMode>,
    ) => {
      state.calendarMode = action.payload;
    },
    openMonthSlider: (state: EventScreenState) => {
      state.enableMonthSlider = true;
    },
    closeMonthSlider: (state: EventScreenState) => {
      state.enableMonthSlider = false;
    },
    pressMonthButton: (state: EventScreenState) => {
      state.enableMonthSlider = !state.enableMonthSlider;
    },
    setMonth: (state: EventScreenState, action: PayloadAction<number>) => {
      state.month = action.payload;
    },
    setLoading: (state: EventScreenState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateMarkedDates: (
      state: EventScreenState,
      action: PayloadAction<string>,
    ) => {
      state.markedDates = Helper.mapEventToMarkedDate(
        state.events,
        action.payload,
      );
    },
  },
  extraReducers: EventExtraReducer,
});

export const EventActions = eventSlice.actions;

const eventReducer = eventSlice.reducer;
export default eventReducer;
