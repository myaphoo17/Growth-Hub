
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CourseModel } from '../../models/instructor/courseModel';
import { ProfileService } from '../../services/instructor/profile.service';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fact-check',
  templateUrl: './fact-check.component.html',
  styleUrl: './fact-check.component.css'
})
export class FactCheckComponent implements OnInit{
  courses: CourseModel[] = [];
  pageSize = 8;
  pageIndex = 0;
  pagedCards: CourseModel[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.getCourses();
  }

  constructor(private instructorService: ProfileService,private router: Router) {}

  showDetails(course:CourseModel) {
    course.showDetail = true;
  }

  hideDetails(course:CourseModel) {
    course.showDetail = false;
  }
  encodeId(id: string): string {
    return Base64.encode(id);
  }
  updatePagedCards() {
    this.pagedCards = this.courses.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
  private getCourses(): void {
    this.instructorService.getUnApprovedCourseList().subscribe({
      next: (data) => {
        this.courses = data;
  
        // Initialize fields if undefined
        this.courses.forEach(course => {
          course.uploadFiles = course.uploadFiles || []; // Initialize files if undefined
          course.categoriesDTO = course.categoriesDTO || { name: '' }; // Initialize category if undefined
          course.employeeDTO = course.employeeDTO || { sr: '' }; // Initialize employeeDTO if undefined
        });
  
        // Sort courses by date or timestamp, most recent first
        this.courses.sort((a, b) => {
          const dateA = new Date(a.date); // Replace 'date' with your property name
          const dateB = new Date(b.date); // Replace 'date' with your property name
          return dateB.getTime() - dateA.getTime();
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
