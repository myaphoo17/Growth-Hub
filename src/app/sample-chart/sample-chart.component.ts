import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { EmployerServiceService } from '../services/admin/employer.service.service';

export interface MonthlyEnrollment {
  month: number;
  studentCount: number;
}

@Component({
  selector: 'app-sample-chart',
  templateUrl: './sample-chart.component.html',
  styleUrls: ['./sample-chart.component.css']
})
export class SampleChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    { data: [], label: 'Enrollment', backgroundColor: [], borderColor: [], borderWidth: 1 }
  ];

  constructor(private employerService: EmployerServiceService) {}

  ngOnInit(): void {
    this.fetchMonthlyEnrollments(2024);
  }

  fetchMonthlyEnrollments(year: number): void {
    this.employerService.getMonthlyEnrollments(year).subscribe(
      (data: MonthlyEnrollment[]) => {
        const months = data.map(entry => this.getMonthName(entry.month));
        const enrollments = data.map(entry => entry.studentCount);

        this.barChartLabels = months;
        this.barChartData[0].data = enrollments;

        // Generate random colors for the chart bars
        const colors = this.generateRandomColors(enrollments.length);
        this.barChartData[0].backgroundColor = colors.map(color => color.replace('0.2', '0.7')); // Adjust alpha for fill
        this.barChartData[0].borderColor = colors.map(color => color.replace('0.2', '1')); // Adjust alpha for border
      },
      error => {
        console.error('Error fetching monthly enrollments:', error);
      }
    );
  }

  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }

  generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      colors.push(color);
    }
    return colors;
  }
}
