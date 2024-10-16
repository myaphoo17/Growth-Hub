import { Component, OnInit } from '@angular/core';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { Employer } from '../../models/admin/employer';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{
  staffId: string = sessionStorage.getItem('userId') || '';
  adminData: Employer = {} as Employer;
  isSidebarOpen = true;
  showAccountsSubmenu: boolean = false;
  constructor(private employerService: EmployerServiceService) {}
  ngOnInit(): void {
    this.instructorProfile();
  } 
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  toggleAccountsSubmenu(): void {
    this.showAccountsSubmenu = !this.showAccountsSubmenu;
  }
  instructorProfile(): void {
    this.employerService.getEmployerByStaffId(this.staffId).subscribe({
      next: (data) => {
        this.adminData = data;
      },
      error: (e) => console.error(e),
    });
  }
}
