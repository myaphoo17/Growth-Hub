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
import { StudentExamService } from '../../services/student/studentexam.service';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-enrolled-user',
  templateUrl: './enrolled-user.component.html',
  styleUrls: ['./enrolled-user.component.css']
})
export class EnrolledUserComponent implements OnInit, AfterViewInit {
  employers: Employer[] = [];
  pagedCards: Employer[] = [];
  encodecourseId!: string;
  encodecourseId2!: string;
  courseId!: number;
  staffId!: string; // Ensure staffId is available and set appropriately
  enrollmentCounts: { [key: string]: number } = {}; // To hold the enrollment count for each staffId
  check = false;
  modalOpen = false;
  modalProfileOpen = false;
  permissionModelOpen = false;
  selectedEmployer: Employer = {} as Employer;
  searchTerm: string = '';
  pageSize = 8;
  pageIndex = 0;
  allSelected = false;
  updateOpen = false;

  columns = [
    { key: 'profilePhotoUrl', label: 'Profile' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'team', label: 'Team' },
    { key: 'division', label: 'Division' },
    { key: 'department', label: 'Department' },
    { key: 'enrollcount', label: 'Enroll-Times' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  visibleColumns: { [key: string]: boolean } = {};
  checkboxState: { [key: string]: boolean } = {};

  constructor(
    private studentService: StudentprofileService,
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
    this.route.queryParams.subscribe(params => {
      this.encodecourseId = params['courseId'];
      this.encodecourseId2 = this.encodecourseId ? Base64.decode(this.encodecourseId) : '';
      this.courseId = Number(this.encodecourseId2);
      this.getEmployers(this.courseId);
    });
  }
  navigateToProfileViewPage(staffId: string) {
  
    this.router.navigate([`/instructor/profile-view`, this.encodeId(staffId)]).then(() => {
      setTimeout(() => {
       
      }, 50);
    });
  }

  goBack(): void {
    window.history.back();
  }

  ngAfterViewInit(): void {
    this.updatePagedCards();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards(); 
  }

  encodeId(id: string): string {
    return Base64.encode(id);
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

  private getEmployers(courseId: number): void {
    this.studentService.getEnrolledStudent(courseId).subscribe(
      (data: Employer[]) => {
        this.employers = data;
        this.updatePagedCards();
        this.getEnrollmentCountsForEmployers();
      },
      error => {
        console.error('Error fetching enrolled students:', error);
      }
    );
  }

  private getEnrollmentCountsForEmployers(): void {
    this.employers.forEach(employer => {
      this.studentService.getEnrollmentCountbyTwoId(this.courseId, employer.staffId).subscribe(
        (count: number) => {
          this.enrollmentCounts[employer.staffId] = count;
          // Update the specific employer's enrollment count
          const employerToUpdate = this.employers.find(e => e.staffId === employer.staffId);
          if (employerToUpdate) {
            employerToUpdate['enrollcount'] = count;
          }
          this.updatePagedCards(); // Ensure the paged data is updated
        },
        error => {
          console.error(`Error fetching enrollment count for staffId ${employer.staffId}:`, error);
        }
      );
    });
  }
  

  initializeColumnVisibility(): void {
    this.columns.forEach(col => {
      this.visibleColumns[col.key] = true;
    });
  }

  getItemValue(item: any, key: string): any {
    const keys = key.split('.');
    let value = item;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) {
        return '';
      }
    }
    return value;
  }
  

  downloadFile(format: string): void {
    const headers = this.columns.map(column => column.label);
    const data = this.employers.map(employer =>
      this.columns.map(column => this.getItemValue(employer, column.key))
    );

    switch (format) {
      case 'pdf':
        this.downloadPDF(headers, data);
        break;
      case 'excel':
        this.downloadExcel(headers, data);
        break;
      case 'csv':
        this.downloadCSV(headers, data);
        break;
      default:
        console.error('Unsupported file format');
    }
  }

  private downloadPDF(headers: string[], data: any[]): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: data
    });
    doc.save('employers.pdf');
  }

  private downloadExcel(headers: string[], data: any[]): void {
    const worksheet = XLSX.utils.json_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employers');
    XLSX.writeFile(workbook, 'employers.xlsx');
  }

  private downloadCSV(headers: string[], data: any[]): void {
    const csv = Papa.unparse({
      fields: headers,
      data: data
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  shouldDisplayColumn(column: string): boolean {
    const anyCheckboxChecked = Object.values(this.checkboxState).some(value => value);
    return anyCheckboxChecked ? this.visibleColumns[column] : true;
  }

  shouldDisplayImage(columnKey: string): boolean {
    return columnKey === 'profilePhotoUrl';
  }
}
