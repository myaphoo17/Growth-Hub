import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class InstAccountsComponent implements OnInit, AfterViewInit {
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

  columns = [
    { key: 'profilePhotoUrl', label: 'Profile' },
    { key: 'name', label: 'Name' },
    { key: 'staffId', label: 'Staff ID' },
    { key: 'status', label: 'Status' },
    { key: 'role', label: 'Role' },
    // Add more columns as needed
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // columns = [
  //   { key: 'profilePhotoUrl', label: 'Profile' },
  //   { key: 'name', label: 'Name' },
  //   { key: 'staffId', label: 'Staff ID' },
  //   { key: 'role', label: 'Role' }
  // ];

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
    this.initializeColumnVisibility();
  }

  ngAfterViewInit(): void {
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


  toggleColumnVisibility(column: string, event: any): void {
    this.checkboxState[column] = event.target.checked;

    const anyCheckboxChecked = Object.values(this.checkboxState).some(value => value);

    if (anyCheckboxChecked) {
      this.columns.forEach(col => {
        this.visibleColumns[col.key] = this.checkboxState[col.key];
      });
    } else {
      // If no checkbox is checked, show all columns
      this.columns.forEach(col => {
        this.visibleColumns[col.key] = true;
      });
    }
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

  initializeColumnVisibility(): void {
    // Initialize all columns to be visible and checkboxes to be unchecked
    this.columns.forEach(column => {
      this.visibleColumns[column.key] = true;
      this.checkboxState[column.key] = false;
    });
  }

  
  shouldDisplayColumn(column: string): boolean {
    const anyCheckboxChecked = Object.values(this.checkboxState).some(value => value);
    return anyCheckboxChecked ? this.visibleColumns[column] : true;
  }

  shouldDisplayImage(columnKey: string): boolean {
    return columnKey === 'profilePhotoUrl';
  }

  getItemValue(item: Employer, columnKey: string): string {
    return item[columnKey as keyof Employer] as string;
  }

  get selectedColumns() {
    const anyCheckboxChecked = Object.values(this.checkboxState).some(value => value);
    return anyCheckboxChecked ? this.columns.filter(column => this.checkboxState[column.key]) : this.columns;
  }

  get selectedData() {
    return this.pagedCards.map(item => {
      const newItem: any = {};
      this.selectedColumns.forEach(column => {
        newItem[column.key] = item[column.key as keyof Employer];
      });
      return newItem;
    });
  }

  isDownloadDisabled(): boolean {
    return false;
  }

  downloadFile(type: string) {
    if (type === 'pdf') {
      this.downloadPDF(this.selectedColumns, this.selectedData);
    } else if (type === 'excel') {
      this.downloadExcel(this.selectedColumns, this.selectedData);
    } else if (type === 'csv') {
      this.downloadCSV(this.selectedColumns, this.selectedData);
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

    doc.save('table.pdf');
  }

  downloadExcel(columns: any[], data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'table.xlsx');
  }

  downloadCSV(columns: any[], data: any[]) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'table.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
