import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartsServices } from '../../../services/charts/charts.service';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';

declare var CanvasJS: any;

interface DataPoint {
  label: string;
  y: number;
}

@Component({
  selector: 'app-int-analysis',
  templateUrl: './int-analysis.component.html',
  styleUrls: ['./int-analysis.component.css']
})
export class IntAnalysisComponent implements OnInit, AfterViewInit {
  chartOptions: any;
  staffId!: number;
  public years: number[] = [];
  private selectedYear!: number;

  constructor(private dataService: ChartsServices) {}

  ngOnInit(): void {
    this.initializeYears();
    const staffIdString = sessionStorage.getItem('dbId');
    if (staffIdString !== null) {
      this.staffId = parseInt(staffIdString, 10);
      this.selectedYear = new Date().getFullYear();
      this.fetchMonthlyData(this.staffId, this.selectedYear);
    } else {
      console.error('Staff ID is not available in session storage');
      return;
    }
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  onYearChange(event: any): void {
    const selectedYear = parseInt(event.target.value, 10);
    this.selectedYear = selectedYear;
    this.fetchMonthlyData(this.staffId, this.selectedYear);
  }

  fetchMonthlyData(staffId: number, year: number): void {
    this.dataService.getMonthlyDatabyId(staffId, year).subscribe(
      (data: MonthlyDataModel[]) => {
        console.log('Fetched Monthly Data:', data); // Check data here
        this.updateChart(data);
      },
      error => {
        console.error('Error fetching monthly data:', error);
      }
    );
  }

  updateChart(data: MonthlyDataModel[]): void {
    console.log('Monthly Data:', data); // Check processed data here
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const enrollmentDataPoints: DataPoint[] = [];
    const creationDataPoints: DataPoint[] = [];
    const totalExamsDataPoints: DataPoint[] = [];
    const passedExamsDataPoints: DataPoint[] = [];
    const failedExamsDataPoints: DataPoint[] = [];

    months.forEach(month => {
      const monthData = data.find(entry => entry.month === month) || { studentEnrollments: 0, coursesCreated: 0, totalExams: 0, passedExams: 0, failedExams: 0 };

      enrollmentDataPoints.push({
        label: this.getMonthName(month),
        y: monthData.studentEnrollments
      });

      creationDataPoints.push({
        label: this.getMonthName(month),
        y: monthData.coursesCreated
      });

      totalExamsDataPoints.push({
        label: this.getMonthName(month),
        y: monthData.totalExams
      });

      passedExamsDataPoints.push({
        label: this.getMonthName(month),
        y: monthData.passedExams
      });

      failedExamsDataPoints.push({
        label: this.getMonthName(month),
        y: monthData.failedExams
      });
    });

    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "Monthly Student Enrollments, Course Creations, and Exam Stats"
      },
      axisX: {
        title: "Months",
        interval: 1
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

  printChart(): void {
    // Ensure the chart is fully rendered before printing
    setTimeout(() => {
      const chartContainer = document.getElementById('chartContainer3');
      if (chartContainer) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
            <head>
              <title>Print Chart</title>
              <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
            </head>
            <body>
              <div id="printChartContainer" style="height: 370px; width: 100%;"></div>
            </body>
            </html>
          `);
          printWindow.document.close();
          
          printWindow.onload = () => {
            const printChartOptions = JSON.parse(JSON.stringify(this.chartOptions));
            const printChart = new (printWindow as any).CanvasJS.Chart('printChartContainer', printChartOptions);
            printChart.render();
            
            // Wait for chart to render before printing
            setTimeout(() => {
              printWindow.print();
            }, 1000); // Adjust delay if needed
          };
        }
      }
    }, 500); // Adjust delay if needed
  }
  
}
