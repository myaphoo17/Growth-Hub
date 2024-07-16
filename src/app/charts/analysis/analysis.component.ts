import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartsServices } from '../../services/charts/charts.service';
import { MonthlyDataModel } from '../../models/charts/MonthlyDataModel';

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

    months.forEach(month => {
      const monthData = data.find(entry => entry.month === month);
      const enrollments = monthData ? monthData.studentEnrollments : 0;
      const creations = monthData ? monthData.coursesCreated : 0;

      enrollmentDataPoints.push({
        label: this.getMonthName(month),
        y: enrollments
      });

      creationDataPoints.push({
        label: this.getMonthName(month),
        y: creations
      });
    });

    console.log('Enrollment Data Points:', enrollmentDataPoints); // Debugging line to check enrollment data points
    console.log('Creation Data Points:', creationDataPoints); // Debugging line to check creation data points

    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "Monthly Student Enrollments and Course Creations"
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
