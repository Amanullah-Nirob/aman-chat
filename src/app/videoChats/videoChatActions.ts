import { Dispatch } from "redux";
import SimplePeer from "simple-peer";
import { RootState } from "../store";
import { actionTypes } from "./types";

export const setLocalStream = (stream: MediaStream | null) => {
    return {
        type: actionTypes.setLocalStream,
        payload: stream,
    };
};

