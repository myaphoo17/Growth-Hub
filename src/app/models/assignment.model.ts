export interface Assignment {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  fileType?: string;
  data?: Uint8Array;
  studentId?: number;
  instructorId?: number;
  courseId?: number; // Add this line

}
