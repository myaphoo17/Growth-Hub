import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseModel } from '../../models/instructor/courseModel';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
@Component({
  selector: 'app-student-has-course',
  templateUrl: './student-has-course.component.html',
  styleUrls: ['./student-has-course.component.css']
})
export class StudentHasCourseComponent implements OnInit{
  courses: StdentCourseModel[] = [];
  pageSize = 8;
  pageIndex = 0;
  pagedCards: StdentCourseModel[] = [];
  staffId: string = sessionStorage.getItem('userId') || '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.getCourses();
    
  }

  constructor(private studentService: StudentprofileService) {}

  showDetails(course:StdentCourseModel) {
    course.showDetail = true;
  }

  hideDetails(course:StdentCourseModel) {
    course.showDetail = false;
  }

  updatePagedCards() {
    this.pagedCards = this.courses.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
  encodeId(id: string): string {
    return Base64.encode(id);
  }
  private getCourses(): void {
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          course.uploadFilesDTO = course.uploadFilesDTO || []; // Initialize files if undefined
          course.categoriesDTO = course.categoriesDTO || { name: '' }; // Initialize category if undefined
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
