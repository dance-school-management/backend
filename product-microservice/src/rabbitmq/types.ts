export interface NotificationMsgData {
  userIds: string[];
  title: string;
  body: string;
  payload: Record<string, unknown>;
}

export interface EnrollStudentsAndInstructorInPrivateClassMsgData {
  classId: number;
  studentIds: string[];
  instructorIds: string[];
}
