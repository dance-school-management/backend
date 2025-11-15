import { rmqProducer } from "../..";
import { ENROLL_STUDENTS_AND_INSTRUCTOR_IN_PRIVATE_CLASS_QUEUE } from "../queues";
import { EnrollStudentsAndInstructorInPrivateClassMsgData } from "../types";

export async function EnrollStudentsAndInstructorInPrivateClass(
  msg: EnrollStudentsAndInstructorInPrivateClassMsgData,
) {
  rmqProducer.sendToQueue(ENROLL_STUDENTS_AND_INSTRUCTOR_IN_PRIVATE_CLASS_QUEUE, msg);
}
