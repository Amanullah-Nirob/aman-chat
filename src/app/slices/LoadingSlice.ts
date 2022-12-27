import { createSlice } from "@reduxjs/toolkit";

// Form Fields State
const LoadingSlice = createSlice({
  name: "LoadingState",
  initialState: {
    loading: false,
    disableIfLoading: ``,
    detectVolume:{},
    remoteDetectVolume:{},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.disableIfLoading = `${state.loading ? "disabled notAllowed" : ""}`;
    },
    setDetectVolume: (state, action) => {
      state.detectVolume = action.payload;
    },
    setRemoteDetectVolume: (state, action) => {
      state.remoteDetectVolume = action.payload;
    },
  },
});

export const { setLoading,setDetectVolume,setRemoteDetectVolume } = LoadingSlice.actions;

export const selectLoadingState = (state:any) => state.LoadingData;

export default LoadingSlice.reducer;
