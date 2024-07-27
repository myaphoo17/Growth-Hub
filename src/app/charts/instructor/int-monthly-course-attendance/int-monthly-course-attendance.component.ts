import { Component, OnInit } from '@angular/core';
import { MonthlyDataModel } from '../../../models/charts/MonthlyDataModel';
import { ChartsServices } from '../../../services/charts/charts.service';
declare var CanvasJS: any;

@Component({
  selector: 'app-int-monthly-course-attendance',
  templateUrl: './int-monthly-course-attendance.component.html',
  styleUrl: './int-monthly-course-attendance.component.css'
})
export class IntMonthlyCourseAttendanceComponent implements OnInit {
  public years: number[] = [];
  private staffId!: number;
  public monthlyAttendances: MonthlyDataModel[] = [];
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
      this.chartsService.getMonthlyDatabyId(this.staffId, year).subscribe(
        (data: MonthlyDataModel[]) => {
          console.log('Fetched data:', data); // Check if data is received
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
    const chartDataPointsStudentCount: { label: string, y: number }[] = [];
    const chartDataPointsCourseCount: { label: string, y: number }[] = [];
  
    data.forEach(entry => {
      chartDataPointsStudentCount.push({
        label: this.getMonthName(entry.month),
        y: entry.studentEnrollments
      });
  
      chartDataPointsCourseCount.push({
        label: this.getMonthName(entry.month),
        y: entry.courseNames.length
      });
    });
  
    this.chartOptions.data[0].dataPoints = chartDataPointsStudentCount;
    this.chartOptions.data[1].dataPoints = chartDataPointsCourseCount;
  
    // Re-create the chart after updating data
    const chart = new CanvasJS.Chart('chartContainer2', this.chartOptions);
    chart.render();
  }
  
  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }
}
