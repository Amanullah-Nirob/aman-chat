import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import {RootState} from '../store'

interface ToastState {
  toastData:{
    isOpen: boolean,
    title: string,
    message: string,
    type: string,
    duration: number,
    position: string,
  }
}

// App Toast State
const ToastSlice = createSlice({
  name: "toast",
  initialState: {
    toastData: {
      isOpen: false,
      title: "",
      message: "Default toast message",
      type: "success",
      duration: 5000,
      position: "bottom-center",
    },
  } as ToastState,
  reducers: {
    displayToast: (state, action: PayloadAction<any>) => {
      state.toastData = { ...action.payload, isOpen: true };
    },
    hideToast: (state) => {
      state.toastData.isOpen = false;
    },
  },
});

export const { displayToast, hideToast } = ToastSlice.actions;

export const selectToastState = (state:RootState) => state.ToastData;

export default ToastSlice.reducer;
