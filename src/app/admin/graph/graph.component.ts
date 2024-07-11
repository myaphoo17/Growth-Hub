import { Component, OnInit } from '@angular/core';
import { EmployerServiceService } from '../../services/admin/employer.service.service';

declare var CanvasJS: any;

export interface MonthlyEnrollment {
  month: number;
  studentCount: number;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  constructor(private employerService: EmployerServiceService) { }

  getMonthName(monthNumber: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  }

  ngOnInit(): void {
    this.employerService.getMonthlyEnrollments(2024).subscribe((data: MonthlyEnrollment[]) => {
      const chartData = data.map(entry => {
        return {
          type: "column", // Use 'column' instead of 'stackedColumn'
          showInLegend: true,
          name: this.getMonthName(entry.month),
          yValueFormatString: "#,### students",
          dataPoints: [{ y: entry.studentCount, label: this.getMonthName(entry.month) }]
        };
      });

      const chart = new CanvasJS.Chart("monthlyChartContainer", {
        title: {
          text: "Monthly Enrollments",
          fontFamily: "Arial",
          fontColor: "#333"
        },
        axisY: {
          title: "Number of Enrollments",
          includeZero: true,
          gridThickness: 1,
          gridColor: "#ccc",
          titleFontColor: "#333",
          labelFontColor: "#666",
          tickColor: "#ccc",
          lineColor: "#ccc"
        },
        legend: {
          cursor: "pointer",
          itemclick: (e: any) => {
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          },
          fontColor: "#333"
        },
        toolTip: {
          shared: true,
          content: "{name}: {y} enrollments"
        },
        data: chartData,
        responsive: true
      });

      chart.render();
    });
  }
}
