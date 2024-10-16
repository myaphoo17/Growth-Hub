import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CourseModel } from '../../models/instructor/courseModel'; // Ensure the import path is correct
import { ProfileService } from '../../services/instructor/profile.service';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { Base64 } from 'js-base64';
import { StudentExamService } from '../../services/student/studentexam.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unapprove-courses',
  templateUrl: './unapprove-courses.component.html',
  styleUrls: ['./unapprove-courses.component.css']
})
export class UnapproveCoursesComponent implements OnInit {
  courses: CourseModel[] = [];
  pageSize = 8;
  pageIndex = 0;
  courseid !:string;
  pagedCards: CourseModel[] = [];
  employerSr!: string;
  examDetails: ExamModel | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private instructorService: ProfileService,
    private cdr: ChangeDetectorRef,
    private studentExamService: StudentExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCourses();
  }

  showDetails(course: CourseModel) {
    course.showDetail = true;
  }
  navigateToExamDetail(Cid :string ): void { 
    this.router.navigate(['/instructor/exam-detail'], { queryParams: { courseId: this.encodeId(Cid) } });
  }
  hideDetails(course: CourseModel) {
    course.showDetail = false;
  }

  updatePagedCards() {
    this.pagedCards = this.courses.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;
    }
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  private getCourses(): void {
    this.employerSr = sessionStorage.getItem('dbId') || '';

    this.instructorService.getUnApprovedCourseListByEmployerId(this.employerSr).subscribe({
      next: (data) => {
        this.courses = data;

        // Initialize fields if undefined
        this.courses.forEach(course => {
         
          course.uploadFiles = course.uploadFiles || [];
          course.categoriesDTO = course.categoriesDTO || { name: '' };
          course.employeeDTO = course.employeeDTO || { sr: '' };
        });

        // Ensure 'date' is a valid property in your CourseModel
        // Sort courses by date or timestamp, most recent first
        this.courses.sort((a, b) => {
          return parseInt(b.id, 10) - parseInt(a.id, 10);
        });

        this.updatePagedCards();
      },
      error: (e) => console.error(e),
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards();
  }

  getFileType(url: string): string {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.ogg'];
    if (url) {
      const extension = url.split('.').pop()?.toLowerCase();
      if (extension && videoExtensions.includes('.' + extension)) {
        return 'video';
      } else if (['.pptx', '.ppt', '.pdf', '.xlsx', '.xls', '.docx'].includes('.' + extension)) {
        return 'document';
      }
    }
    return 'other';
  }

  getVideoFiles(files: UploadFiles[]): UploadFiles[] {
    return files.filter(file => file.url.endsWith('.mp4') || file.url.endsWith('.webm') || file.url.endsWith('.ogg')); // Add other video formats as needed
  }

  getDocumentFiles(files: UploadFiles[]): UploadFiles[] {
    return files.filter(file => this.getFileType(file.url) === 'document');
  }
}
