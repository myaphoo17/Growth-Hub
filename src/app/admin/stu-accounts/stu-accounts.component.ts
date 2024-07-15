
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Employer } from '../../models/admin/employer';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
@Component({
  selector: 'app-stu-accounts',
  templateUrl: './stu-accounts.component.html',
  styleUrl: './stu-accounts.component.css'
})
export class StuAccountsComponent implements OnInit{
  employers: Employer[] = [];
  pagedCards: Employer[] = [];
  staffId!: string;
  check = false;
  modalOpen = false;
  updateOpen = false;
  modalProfileOpen = false;
  permissionModelOpen = false;
  selectedEmployer: Employer = {} as Employer;
  Employer: Employer = {} as Employer;
  searchTerm: string = '';
  pageSize = 8;
  pageIndex = 0;
  refreshInterval: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employerService: EmployerServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.staffId = this.route.snapshot.params['staffId'];
    this.getEmployers();
    this.refreshInterval = setInterval(() => {
      this.getEmployers();
    }, 10000); // Adjust the interval as needed
  }
  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  ngAfterViewInit() {
    this.updatePagedCards();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards();
  }
  updatePagedCards(): void {
    this.pagedCards = this.employers.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  openModal(employer: Employer): void {
    this.selectedEmployer = employer;
    this.modalOpen = true;
  }

  openProfileModal(staffId: string): void {
    console.log(`Opening profile modal for staffId: ${staffId}`);
    this.employerService.getEmployerByStaffId(staffId).subscribe({
      next: (data) => {
        this.selectedEmployer = data;
        this.modalProfileOpen = true;
        console.log('Profile modal opened:', this.selectedEmployer);
      },
      error: (e) => console.error(e),
    });
  }
  openUpdateModal(staffId: string): void {
    this.employerService.getEmployerByStaffId(staffId).subscribe({
      next: (data) => {
        this.selectedEmployer = data;
        this.updateOpen = true;
      },
      error: (e) => console.error(e),
    });
  }
  updateEmployer(sr: number): void {
    if (!this.selectedEmployer) {
      console.error('No employer selected');
      return;
    }
    this.employerService.updateEmployer(sr, this.selectedEmployer).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => console.error(e),
    });
    this.closeUpdateModal();

  }

  openPermissionModal(employer: Employer): void {
    this.selectedEmployer = employer;
    this.permissionModelOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }
  closeUpdateModal(): void {
    this.updateOpen = false;
  }

  closeProfileModal(): void {
    this.modalProfileOpen = false;
  }

  closePermissionModal(): void {
    this.permissionModelOpen = false;
  }

  updateEmployerRole(staffId: string): void {
    if (!this.selectedEmployer) {
      console.error('No employer selected');
      return;
    }
    this.employerService.updateEmployerRole(staffId, this.selectedEmployer).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => console.error(e),
    });
    this.closeModal();
  }

  updatePermissionEmployer(staffId: string): void {
    if (!this.selectedEmployer) {
      console.error('No employer selected');
      return;
    }
    this.employerService.changeEmployerPermission(staffId, this.selectedEmployer).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => console.error(e),
    });
    this.closePermissionModal();
  }
  private getEmployers(): void {
    this.employerService.getEmployerStudentList().subscribe({
      next: (data) => {
        this.employers = data;
        this.updatePagedCards();
        if (this.employers.length !== 0) {
          this.check = true;
        }
      },
      error: (e) => console.error(e),
    });
  }
}
