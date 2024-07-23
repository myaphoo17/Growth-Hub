import { Component, OnInit } from '@angular/core';
import { AmountOfAccount } from '../../models/admin/amountModel';
import { EmployerServiceService } from '../../services/admin/employer.service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  employer: AmountOfAccount = {} as AmountOfAccount;
  ngOnInit(): void {
    this.getAmounts();
  }
  constructor(
    private employerService: EmployerServiceService,
  ) {}
  private getAmounts(): void {
    this.employerService.getAmountOfAccount().subscribe({
      next: (data) => {
        this.employer= data;
      },
      error: (e) => console.error(e),
    });
  }
}
