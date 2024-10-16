import { Component, OnInit } from '@angular/core';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';
import { ChartsServices } from '../../../services/charts/charts.service';


declare var CanvasJS: any;

@Component({
  selector: 'app-monthly-course-attendance',
  templateUrl: './monthly-course-attendance.component.html',
  styleUrls: ['./monthly-course-attendance.component.css']
})
export class MonthlyCourseAttendanceComponent implements OnInit {
  public years: number[] = [];
  public monthlyAttendances: MonthlyDataModel[] = [];
  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    exportEnabled: true,
    title: {
      text: ""
    },
    axisY: {
      title: "Count"
    },
    axisX: {
      title: "Months",
      interval: 1
    },
    data: [{
      type: "column",
      showInLegend: true,
      name: "Count",
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
    this.chartsService.getMonthlyData(year).subscribe(
      (data: MonthlyDataModel[]) => {
        this.monthlyAttendances = data;
        this.updateChart(data);
      },
      error => {
        console.error('Error fetching monthly course attendance:', error);
      }
    );
  }

  updateChart(data: MonthlyDataModel[]): void {
    const chartDataPointsStudentCount: { label: string, y: number }[] = [];
    const chartDataPointsCourseCount: { label: string, y: number }[] = [];

    data.forEach(entry => {
      chartDataPointsStudentCount.push({
        label: this.getMonthName(entry.month),
        y: entry.studentEnrollments
      });

      chartDataPointsCourseCount.push({
        label: this.getMonthName(entry.month),
        y: entry.courseNames.length // Assuming `courseNames` is an array of course names
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

  getCoursesInMonth(month: number, data: MonthlyDataModel[]): MonthlyDataModel[] {
    return data.filter(entry => entry.month === month);
  }
}
