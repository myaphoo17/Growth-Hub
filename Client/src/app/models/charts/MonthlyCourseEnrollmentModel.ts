export interface MonthlyCourseEnrollmentModel {
  month: number;
  courseId: number;
  courseName: string;
  enrollmentCount: number; // Ensure this is a number and not a string
}
