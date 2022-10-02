import { createSlice } from "@reduxjs/toolkit";

// Form Fields State
const LoadingSlice = createSlice({
  name: "LoadingState",
  initialState: {
    loading: false,
    disableIfLoading: ``,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.disableIfLoading = `${state.loading ? "disabled notAllowed" : ""}`;
    },
  },
});

export const { setLoading } = LoadingSlice.actions;

export const selectLoadingState = (state:any) => state.LoadingData;

export default LoadingSlice.reducer;
