import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-course-details-side-bar',
  templateUrl: './student-course-details-side-bar.component.html',
  styleUrls: ['./student-course-details-side-bar.component.css']
})
export class StudentCourseDetailsSideBarComponent {
  modules = ['Module 1', 'Module 2', 'Module 3'];
  selectedItem: string = 'Module 1';
  fileId!: string;
  id!: string;
  showInstructorModal = false;
  showInsertModal = false;
  showEditModal = false;
  showDeleteModal = false;
  videos: UploadFiles[] = [];
  currentVideoIndex = 0;
  videosPerPage = 4;
  newVideo = { title: '', file: null };
  selectedFile: File | null = null;

  showSuccessModal = false;
  private videoIdCounter = 0; // Counter for generating unique IDs


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private instructorService: ProfileService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private http: HttpClient,
    ) {}

    
  private getCoursesById(id: string): void {
    this.instructorService.getCourseListById(id).subscribe({
      next: (data) => {
        this.videos = data;
        if (this.videos.length > 0) {
          this.currentVideoIndex = 0; // Select the first video by default
        }
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (e) => console.error(e),
    });
  }


  selectItem(item: string): void {
    this.selectedItem = item;
    if (item === 'Grades') {
      this.router.navigate(['/student/grades']);
    } else if (item === 'Notes') {
      this.router.navigate(['/student/notes']);
    } else if (item === 'Assignment') {
      this.router.navigate(['/student/assignment']);
    }
  }

  
}
