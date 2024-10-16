export class MonthlyDataModel {
  month: number;
  studentEnrollments: number;
  coursesCreated: number;
  courseNames: string[];
  totalExams: number;
  passedExams: number;
  failedExams: number;

  constructor(
    month: number,
    studentEnrollments: number,
    coursesCreated: number,
    courseNames: string[],
    totalExams: number,
    passedExams: number,
    failedExams: number
  ) {
    this.month = month;
    this.studentEnrollments = studentEnrollments;
    this.coursesCreated = coursesCreated;
    this.courseNames = courseNames;
    this.totalExams = totalExams;
    this.passedExams = passedExams;
    this.failedExams = failedExams;
  }
}
