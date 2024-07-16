import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CourseModel } from '../../models/instructor/courseModel'; // Ensure the import path is correct
import { ProfileService } from '../../services/instructor/profile.service';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit {
  courses: CourseModel[] = [];
  pageSize = 8;
  pageIndex = 0;
  pagedCards: CourseModel[] = [];
  employerSr!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.getCourses();
  }

  constructor(private instructorService: ProfileService) {}

  showDetails(course: CourseModel) {
    course.showDetail = true;
  }

  hideDetails(course: CourseModel) {
    course.showDetail = false;
  }

  updatePagedCards() {
    this.pagedCards = this.courses.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }


  private getCourses(): void {
    this.employerSr = sessionStorage.getItem('dbId') || '';
    this.instructorService.getApprovedCourseList(this.employerSr).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          course.uploadFiles = course.uploadFiles || []; // Initialize files if undefined
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
