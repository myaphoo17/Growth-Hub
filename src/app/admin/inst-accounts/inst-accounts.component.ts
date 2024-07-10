import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Employer } from '../../models/admin/employer';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

@Component({

  selector: 'app-inst-accounts',
  templateUrl: './inst-accounts.component.html',
  styleUrls: ['./inst-accounts.component.css']
})
export class InstAccountsComponent implements OnInit {
  employers: Employer[] = [];
  pagedCards: Employer[] = [];
  staffId!: string;
  check = false;
  modalOpen = false;
  modalProfileOpen = false;
  permissionModelOpen = false;
  selectedEmployer: Employer = {} as Employer;
  searchTerm: string = '';
  pageSize = 8;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = [
    { key: 'profilePhotoUrl', label: 'Profile' },
    { key: 'name', label: 'Name' },
    { key: 'staffId', label: 'Staff ID' },
    // { key: 'status', label: 'Status' },
    { key: 'role', label: 'Role' },
    // { key: 'profileAction', label: 'Profile' },
    // { key: 'roleUpdate', label: 'Role Update' },
    // { key: 'statusPermission', label: 'Status' }
  ];

  visibleColumns: { [key: string]: boolean } = {};
  checkboxState: { [key: string]: boolean } = {};

  constructor(
    private employerService: EmployerServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.columns.forEach(column => {
      this.visibleColumns[column.key] = true;
      this.checkboxState[column.key] = false;
    });
  }

  ngOnInit(): void {
    this.staffId = this.route.snapshot.params['staffId'];
    this.getEmployers();
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

  toggleColumnVisibility(column: string, event: any) {
    this.checkboxState[column] = event.target.checked;

    const anyCheckboxChecked = Object.values(this.checkboxState).some(value => value);

    if (anyCheckboxChecked) {
      this.columns.forEach(col => {
        this.visibleColumns[col.key] = this.checkboxState[col.key];
      });
    } else {
      this.columns.forEach(col => {
        this.visibleColumns[col.key] = true;
      });
    }
  }

  shouldDisplayColumn(column: string): boolean {
    return this.visibleColumns[column];
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

  openPermissionModal(employer: Employer): void {
    this.selectedEmployer = employer;
    this.permissionModelOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
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
    this.employerService.getEmployerList().subscribe({
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

  downloadFile(type: string) {
    const selectedColumns = this.columns.filter(column => this.checkboxState[column.key]);

    if (selectedColumns.length === 0) {
      alert('Please select at least one column to download.');
      return;
    }

    const selectedData = this.pagedCards.map(item => {
      const newItem: any = {};
      selectedColumns.forEach(column => {
        newItem[column.key] = item[column.key as keyof Employer];
      });
      return newItem;
    });

    if (type === 'pdf') {
      this.downloadPDF(selectedColumns, selectedData);
    } else if (type === 'excel') {
      this.downloadExcel(selectedColumns, selectedData);
    } else if (type === 'csv') {
      this.downloadCSV(selectedColumns, selectedData);
    }
  }

  downloadPDF(columns: any[], data: any[]) {
    const doc = new jsPDF();
    const headers = columns.map(col => col.label);
    const rows = data.map(item => columns.map(col => item[col.key]));

    autoTable(doc, {
      head: [headers],
      body: rows
    });

    doc.save('employers.pdf');
  }

  downloadExcel(columns: any[], data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'employers.xlsx');
  }

  downloadCSV(columns: any[], data: any[]) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
