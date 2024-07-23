import { Component, OnInit } from '@angular/core';
import { ChartsServices } from '../../services/charts/charts.service';
import { MonthlyCourseEnrollmentModel } from '../../models/charts/MonthlyCourseEnrollmentModel';
import { MonthlyDataModel } from '../../models/charts/MonthlyDataModel';

declare var CanvasJS: any;

@Component({
  selector: 'app-sample-chart',
  templateUrl: './sample-chart.component.html',
  styleUrls: ['./sample-chart.component.css']
})
export class SampleChartComponent implements OnInit {
  public years: number[] = [];
  public monthlyAttendances: MonthlyDataModel[] = [];
  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2", // Change to "light2" or any other theme you prefer
    exportEnabled: true,
    title: {
      text: ""
    },
    subtitles: [{
      text: "Total Students Enrolled"
    }],
    data: [{
      type: "doughnut",
      indexLabel: "{name}: {y} students",
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
    const chartDataPoints = data.map(entry => ({
      name: this.getMonthName(entry.month),
      y: entry.studentEnrollments
    }));

    this.chartOptions.data[0].dataPoints = chartDataPoints;
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
      const chart = new CanvasJS.Chart(chartContainer, this.chartOptions);
      chart.render();
    }
  }

  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }
}
