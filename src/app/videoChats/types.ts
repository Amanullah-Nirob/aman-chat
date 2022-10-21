
export enum actionTypes {
    setLocalStream,
}
interface SetLocalStream {
    type: actionTypes.setLocalStream;
    payload: MediaStream | null;
}
export type VideoChatActions = SetLocalStream;