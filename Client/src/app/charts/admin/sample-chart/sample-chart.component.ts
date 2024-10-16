import { Component, OnInit } from '@angular/core';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';
import { ChartsServices } from '../../../services/charts/charts.service';
import { MonthlyCourseEnrollmentModel } from '../../../models/charts/MonthlyCourseEnrollmentModel';

declare var CanvasJS: any;

@Component({
  selector: 'app-sample-chart',
  templateUrl: './sample-chart.component.html',
  styleUrls: ['./sample-chart.component.css']
})
export class SampleChartComponent implements OnInit {
  public years: number[] = [];
  private staffId!: string;
  private selectedYear!: number;
  public courseEnrollmentData: MonthlyCourseEnrollmentModel[] = [];
  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
    exportEnabled: true,
    title: {
      text: "Enrollments by Course"
    },
    subtitles: [{
      text: "Total Students Enrolled"
    }],
    data: [{
      type: "doughnut",
      indexLabel: "{label}: {y} students",
      dataPoints: []
    }]
  };

  constructor(private chartsService: ChartsServices) {}

  ngOnInit(): void {
    this.initializeYears();
    const staffIdString = sessionStorage.getItem('userId');
    if (staffIdString !== null) {
      this.staffId = staffIdString;
      this.selectedYear = new Date().getFullYear();
      this.fetchCourseEnrollmentData(this.selectedYear);
    } else {
      console.error('Staff ID is not valid.');
    }
  }

  onYearChange(event: any): void {
    const selectedYear = parseInt(event.target.value, 10);
    this.selectedYear = selectedYear;
    this.fetchCourseEnrollmentData(this.selectedYear);
  }

  fetchCourseEnrollmentData(year: number): void {
    this.chartsService.getEnrollmentsByAllCourseId( year).subscribe(
      (data: MonthlyCourseEnrollmentModel[]) => {
        console.log('Fetched Course Enrollment Data:', data); // Log the raw data
        // Map the API response to the expected model
        this.courseEnrollmentData = data.map(item => ({
          ...item,
          studentCount: item.enrollmentCount // Map enrollmentCount to studentCount
        }));
        this.updateChart(this.courseEnrollmentData);
      },
      error => {
        console.error('Error fetching course enrollment data:', error);
      }
    );
  }

  updateChart(data: MonthlyCourseEnrollmentModel[]): void {
    const chartDataPoints = data.map(entry => {
      console.log('Processing entry:', entry); // Log each entry being processed
      const studentCount = Number(entry.enrollmentCount); // Ensure it's a number
      return {
        label: entry.courseName,
        y: isNaN(studentCount) ? 0 : studentCount // Default to 0 if invalid
      };
    });

    console.log('Chart Data Points:', chartDataPoints); // Debugging log

    this.chartOptions.data[0].dataPoints = chartDataPoints;
    this.renderChart();
  }

  renderChart(): void {
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
      const chart = new CanvasJS.Chart(chartContainer, this.chartOptions);
      chart.render();
    }
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }
}