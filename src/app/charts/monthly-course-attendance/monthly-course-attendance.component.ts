import { Component, OnInit } from '@angular/core';
import { ChartsServices } from '../../services/charts/charts.service';
import { MonthlyCourseEnrollmentModel } from '../../models/charts/MonthlyCourseEnrollmentModel';

declare var CanvasJS: any;

@Component({
  selector: 'app-monthly-course-attendance',
  templateUrl: './monthly-course-attendance.component.html',
  styleUrls: ['./monthly-course-attendance.component.css']
})
export class MonthlyCourseAttendanceComponent implements OnInit {
  public years: number[] = [];
  
  public monthlyAttendances: MonthlyCourseEnrollmentModel[] = [];
  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    exportEnabled: true,
    title: {
      text: ""
    },
    axisY: {
      title: "Student Count"
    },
    axisX: {
      title: "Months",
      interval: 1
    },
    data: [{
      type: "column",
      showInLegend: true,
      name: "Student Count",
      color: "#007bff",
      dataPoints: []
    },
    {
      type: "column",
      showInLegend: true,
      name: "Course Count",
      color: "#28a745",
      dataPoints: []
    }]
  };

  constructor(private chartsService: ChartsServices) {}

  ngOnInit(): void {
    this.initializeYears();
    this.fetchMonthlyCourseAttendance(new Date().getFullYear());
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  onYearChange(event: any): void {
    const selectedYear = event.target.value;
    this.fetchMonthlyCourseAttendance(selectedYear);
  }

  fetchMonthlyCourseAttendance(year: number): void {
    this.chartsService.getMonthlyCourseAttendance(year).subscribe(
      (data: MonthlyCourseEnrollmentModel[]) => {
        this.monthlyAttendances = data;
        this.updateChart(data);
      },
      error => {
        console.error('Error fetching monthly course attendance:', error);
      }
    );
  }

  updateChart(data: MonthlyCourseEnrollmentModel[]): void {
    const chartDataPointsStudentCount: { label: string, y: number }[] = [];
    const chartDataPointsCourseCount: { label: string, y: number }[] = [];
  
    data.forEach(entry => {
      chartDataPointsStudentCount.push({
        label: this.getMonthName(entry.month),
        y: entry.studentCount
      });
  
      chartDataPointsCourseCount.push({
        label: this.getMonthName(entry.month),
        y: this.getUniqueCourseCount(entry.month, data)
      });
    });
  
    this.chartOptions.data[0].dataPoints = chartDataPointsStudentCount;
    this.chartOptions.data[1].dataPoints = chartDataPointsCourseCount;
  
    const chart = new CanvasJS.Chart('chartContainer2', this.chartOptions);
    chart.render();
  }
  

  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }

  getUniqueCourseCount(month: number, data: MonthlyCourseEnrollmentModel[]): number {
    const courses = new Set<string>();
    data.forEach(entry => {
      if (entry.month === month) {
        courses.add(entry.courseName);
      }
    });
    return courses.size;
  }

  getCoursesInMonth(month: number, data: MonthlyCourseEnrollmentModel[]): MonthlyCourseEnrollmentModel[] {
    return data.filter(entry => entry.month === month);
  }
}
