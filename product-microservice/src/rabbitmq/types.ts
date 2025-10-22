export interface MsgData {
  userId: string;
  title: string;
  body: string;
  payload: Record<string, unknown>;
}