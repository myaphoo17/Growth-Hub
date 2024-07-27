import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartsServices } from '../../../services/charts/charts.service';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';

declare var CanvasJS: any;

interface DataPoint {
  label: string;
  y: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  chartOptions: any;

  constructor(private dataService: ChartsServices) {}

  ngOnInit(): void {
    this.fetchMonthlyData(new Date().getFullYear());
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  fetchMonthlyData(year: number): void {
    this.dataService.getMonthlyData(year).subscribe(
      (data: MonthlyDataModel[]) => {
        console.log('Fetched Monthly Data:', data); // Debugging line to check fetched data
        this.updateChart(data);
      },
      error => {
        console.error('Error fetching monthly data:', error);
      }
    );
  }

  updateChart(data: MonthlyDataModel[]): void {
    console.log('Monthly Data:', data); // Debugging line to check mapped data
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // Ensure all 12 months are included
    const enrollmentDataPoints: DataPoint[] = [];
    const creationDataPoints: DataPoint[] = [];
    const totalExamsDataPoints: DataPoint[] = [];
    const passedExamsDataPoints: DataPoint[] = [];
    const failedExamsDataPoints: DataPoint[] = [];

    months.forEach(month => {
      const monthData = data.find(entry => entry.month === month) || { studentEnrollments: 0, coursesCreated: 0, totalExams: 0, passedExams: 0, failedExams: 0 };

      const enrollments = monthData.studentEnrollments;
      const creations = monthData.coursesCreated;
      const totalExams = monthData.totalExams;
      const passedExams = monthData.passedExams;
      const failedExams = monthData.failedExams;

      enrollmentDataPoints.push({
        label: this.getMonthName(month),
        y: enrollments
      });

      creationDataPoints.push({
        label: this.getMonthName(month),
        y: creations
      });

      totalExamsDataPoints.push({
        label: this.getMonthName(month),
        y: totalExams
      });

      passedExamsDataPoints.push({
        label: this.getMonthName(month),
        y: passedExams
      });

      failedExamsDataPoints.push({
        label: this.getMonthName(month),
        y: failedExams
      });
    });

    console.log('Enrollment Data Points:', enrollmentDataPoints); // Debugging line to check enrollment data points
    console.log('Creation Data Points:', creationDataPoints); // Debugging line to check creation data points
    console.log('Total Exams Data Points:', totalExamsDataPoints); // Debugging line to check total exams data points
    console.log('Passed Exams Data Points:', passedExamsDataPoints); // Debugging line to check passed exams data points
    console.log('Failed Exams Data Points:', failedExamsDataPoints); // Debugging line to check failed exams data points

    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "Monthly Student Enrollments, Course Creations, and Exam Stats"
      },
      axisX: {
        title: "Months",
        interval: 1 // Ensure all months are displayed
      },
      axisY: {
        title: "Count",
        labelFormatter: function (e: any) {
          return e.value.toFixed(0);
        }
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "spline",
        showInLegend: true,
        name: "Student Enrollments",
        dataPoints: enrollmentDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Courses Created",
        dataPoints: creationDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Total Exams",
        dataPoints: totalExamsDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Passed Exams",
        dataPoints: passedExamsDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Failed Exams",
        dataPoints: failedExamsDataPoints
      }]
    };

    this.renderChart();
  }

  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }

  renderChart(): void {
    const chart = new CanvasJS.Chart('chartContainer3', this.chartOptions);
    chart.render();
  }
}
