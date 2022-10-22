import { Reducer } from "redux";
import { actionTypes, VideoChatActions } from "./types";

export interface VideoChatState {
    localStream: MediaStream | null;
}

const initialState: VideoChatState = {
    localStream: null,
};

const videoChatReducer: Reducer<VideoChatState, VideoChatActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.setLocalStream:
            return {
                ...state,
                localStream: action.payload,
            };
        default:
            return state;
    }
};
export default videoChatReducer;
