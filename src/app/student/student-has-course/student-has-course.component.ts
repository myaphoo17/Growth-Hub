import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { ActivatedRoute , Router } from '@angular/router';
@Component({
  selector: 'app-student-has-course',
  templateUrl: './student-has-course.component.html',
  styleUrls: ['./student-has-course.component.css']
})
export class StudentHasCourseComponent implements OnInit{
  courses: StdentCourseModel[] = [];
<<<<<<< HEAD
  id!: string;
  pageSize = 8;
  pageIndex = 0;
=======
 
>>>>>>> b9eb9f98ea40ea2cfc48e01463d1ff98ec3177a8
  pagedCards: StdentCourseModel[] = [];
  staffId: string = sessionStorage.getItem('userId') || '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      this.id = encodedId ? Base64.decode(encodedId) : '';
      this.getCourses();
    });
  }

  constructor(private studentService: StudentprofileService , private route: ActivatedRoute, private router: Router) {}

  showDetails(course:StdentCourseModel) {
    course.showDetail = true;
  }

  hideDetails(course:StdentCourseModel) {
    course.showDetail = false;
  }


  encodeId(id: string): string {
    return Base64.encode(id);
  }
  private getCourses(): void {
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          course.uploadFilesDTO = course.uploadFilesDTO || []; 
          course.categoriesDTO = course.categoriesDTO || { name: '' }; 
        });
      },
      error: (e) => console.error(e),
    });
  }

  // navigateToStudentExam(courseId: string): void {
  //   this.router.navigate(['/student/student-exam'], { queryParams: { courseId: this.encodeId(courseId) } });
  // }

  navigateToStudentExam(courseId: string): void {
    this.router.navigate(['/student/student-exam'], { queryParams: { courseId: courseId, staffId: this.staffId } });
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
