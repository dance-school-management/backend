export interface MsgData {
  userIds: string[];
  title: string;
  body: string;
  payload: Record<string, unknown>;
}