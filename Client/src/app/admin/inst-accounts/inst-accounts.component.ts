import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Employer } from '../../models/admin/employer';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  showReport = false;  // New property to toggle report visibility
  allSelected = false; // New property to track select all state
  currentStep = 1;
  updateOpen = false;
  pdfHeadline: string = '';


  columns = [
    { key: 'name', label: 'Name' },
    { key: 'staffId', label: 'Staff ID' },
    { key: 'status', label: 'Status' },
    { key: 'role', label: 'Role' },
    { key: 'team', label: 'Team' },
    { key: 'division', label: 'Division' },
    { key: 'department', label: 'Department' },
  ];

 
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  visibleColumns: { [key: string]: boolean } = {};
  checkboxState: { [key: string]: boolean } = {};

  constructor(
    private employerService: EmployerServiceService,
    private router: Router,
   
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.columns.forEach(column => {
      this.visibleColumns[column.key] = true;
      this.checkboxState[column.key] = true;
    });
  }

  ngOnInit(): void {
    this.staffId = this.route.snapshot.params['staffId'];
    this.getEmployers();
    this.initializeColumnVisibility();
  }
  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  ngAfterViewInit(): void {
    this.updatePagedCards();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards();
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.allSelected = isChecked;
    this.columns.forEach(column => {
      this.checkboxState[column.key] = isChecked;
    });
    this.updateVisibleColumns();
  }

  updateVisibleColumns(): void {
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

  updatePagedCards(): void {
    this.pagedCards = this.employers.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  toggleColumnVisibility(column: string, event: any): void {
    this.checkboxState[column] = event.target.checked;
    this.updateVisibleColumns();
  }

  openModal(employer: Employer): void {
    this.selectedEmployer = employer;
    this.modalOpen = true;
  }
 closeUpdateModal(): void {
    this.updateOpen = false;
  }

  updateEmployer(sr: number): void {
    if (!this.selectedEmployer) {
      this.snackBar.open('No employer selected', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      console.error('No employer selected');
      return;
    }

    // Perform update operation
    this.employerService.updateEmployer(sr, this.selectedEmployer).subscribe({
      next: (data) => {
        console.log(data);
        this.snackBar.open('Employer updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.closeUpdateModal();
      },
      error: (e) => {
        console.error(e);
        this.snackBar.open('Failed to update employer', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
    });
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
        this.snackBar.open('Employer role updated successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          verticalPosition: 'bottom', // 'top' or 'bottom'
          horizontalPosition: 'right', // 'start', 'center', 'end', 'left', 'right'
          panelClass: ['success-snackbar'] // Optional, for custom styling
        });
        this.closeModal();
      },
      error: (e) => {
        console.error(e);
        this.snackBar.open('Failed to update employer role.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          panelClass: ['error-snackbar']
        });
      }
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
  updatePermissionEmployer(staffId: string): void {
    if (!this.selectedEmployer) {
      console.error('No employer selected');
      return;
    }
    this.employerService.changeEmployerPermission(staffId, this.selectedEmployer).subscribe({
      next: (data) => {
        console.log(data);
        this.snackBar.open('Permission updated successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          verticalPosition: 'bottom', // 'top' or 'bottom'
          horizontalPosition: 'right', // 'start', 'center', 'end', 'left', 'right'
          panelClass: ['success-snackbar'] // Optional, for custom styling
        });
        this.closePermissionModal();
      },
      error: (e) => {
        console.error(e);
        this.snackBar.open('Failed to update permission.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          panelClass: ['error-snackbar']
        });
      },
    });
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
  downloadPDF(columns: any[], data: any[]): void {
    const doc = new jsPDF();
    if (this.pdfHeadline) {
      doc.setFontSize(16);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(this.pdfHeadline);
      const textX = (pageWidth - textWidth) / 2;
      doc.text(this.pdfHeadline, textX, 10);
    const headers = columns.map(col => col.label);
    const rows = data.map(item => columns.map(col => item[col.key]));
  
    autoTable(doc, {
      head: [headers],
      body: rows,
    });
  
    doc.save('table.pdf');
    this.showToast('PDF downloaded successfully!', 'success');
  }
}

  downloadExcel(columns: any[], data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'table.xlsx');
    this.showToast('Excel file downloaded successfully!', 'success');
  }
  

  downloadCSV(columns: any[], data: any[]): void {
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
    this.showToast('CSV file downloaded successfully!', 'success');
  }
  

  toggleReport(): void {
    this.showReport = !this.showReport;
  }
  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,  // Adjust duration as needed
      panelClass: type === 'success' ? 'toast-success' : 'toast-error',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}