import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { EmployerServiceService } from '../services/admin/employer.service.service';

@Component({
  selector: 'app-course-attendance',
  templateUrl: './course-attendance.component.html',
  styleUrls: ['./course-attendance.component.css']
})
export class CourseAttendanceComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    { data: [], label: 'Attendance Count', backgroundColor: 'rgba(148,159,177,0.2)', borderColor: 'rgba(148,159,177,1)', borderWidth: 1 }
  ];

  constructor(private courseAttendanceService: EmployerServiceService) {}

  ngOnInit(): void {
    // this.fetchCourseAttendanceData();
  }

  // fetchCourseAttendanceData(): void {
  //   // Assuming your service returns data in a structure like this
  //   this.courseAttendanceService.getCourseAttendanceData().subscribe(
  //     (data: any[]) => {
  //       const courses = data.map(entry => entry.courseName);
  //       const attendanceCounts = data.map(entry => entry.attendanceCount);

  //       this.barChartLabels = courses;
  //       this.barChartData[0].data = attendanceCounts;
  //     },
  //     error => {
  //       console.error('Error fetching course attendance data:', error);
  //     }
  //   );
  // }
}
