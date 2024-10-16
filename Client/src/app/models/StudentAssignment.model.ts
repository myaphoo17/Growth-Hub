// student-assignment.model.ts
export interface StudentAssignment {
  id: number;
  studentId: string;
  assignmentId: number;
  fileType: string;
  data: Uint8Array;
  fileName: string; // Added fileName property
  comment: string;
  submittedDate: string;
}