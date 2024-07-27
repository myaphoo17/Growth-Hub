import { Component, OnInit } from '@angular/core';
import { ChartsServices } from '../../../services/charts/charts.service';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';
declare var CanvasJS: any;

@Component({
  selector: 'app-int-simple-chart',
  templateUrl: './int-simple-chart.component.html',
  styleUrl: './int-simple-chart.component.css'
})
export class IntSimpleChartComponent implements OnInit {
  public years: number[] = [];
  private staffId!: number;  // Add this property
  public monthlyAttendances: MonthlyDataModel[] = [];
  public chartOptions: any = {
    animationEnabled: true,
    theme: "light2",
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
    const staffIdString = sessionStorage.getItem('dbId');
    
    if (staffIdString !== null) {
      this.staffId = parseInt(staffIdString, 10);
      
      if (this.staffId) {
        // Fetch monthly course attendance for the current year
        this.fetchMonthlyCourseAttendance(new Date().getFullYear());
      } else {
        console.error('Staff ID is not valid.');
      }
    } else {
      console.error('Staff ID is not available in session storage');
    }
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  onYearChange(event: any): void {
    const selectedYear = event.target.value;
    if (this.staffId) {
      this.fetchMonthlyCourseAttendance(selectedYear);
    }
  }

  fetchMonthlyCourseAttendance(year: number): void {
    if (this.staffId) {
      this.chartsService.getMonthlyDatabyId(this.staffId,year).subscribe(
        (data: MonthlyDataModel[]) => {
          this.monthlyAttendances = data;
          this.updateChart(data);
        },
        error => {
          console.error('Error fetching monthly course attendance:', error);
        }
      );
    } else {
      console.error('Staff ID is not available.');
    }
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
