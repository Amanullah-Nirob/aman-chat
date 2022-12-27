import { createSlice } from "@reduxjs/toolkit";

// Form Fields State
const importantForCall = createSlice({
  name: "importantForCall",
  initialState: {
    callerInfo:{}
  },
  reducers: {
    setCallerInfo: (state, action) => {
        state.callerInfo = action.payload;
    },
  },
});

export const { setCallerInfo} = importantForCall.actions;

export const selectImportantForCall = (state:any) => state.importantForCall;

export default importantForCall.reducer;
