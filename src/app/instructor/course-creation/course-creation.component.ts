import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ObjectModel } from '../../models/instructor/objectModel';
import { ProfileService } from '../../services/instructor/profile.service';
import { LoadingService } from '../../pageloading/loading.service';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { WebSocketService } from '../../chat/service/web-socket.service';

interface Lecture {
  title: string;
  file: File | null;
}

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.css']
})
export class CourseCreationComponent {
  currentStep = 1;
  newObject: ObjectModel = {} as ObjectModel;
  lectures: Lecture[] = [];
  showSuccessModal = false;
  userId = sessionStorage.getItem('userId');

  // Add newLectureTitle and newLectureFile properties
  newLectureTitle: string = '';
  newLectureFile: File | null = null;

  constructor(
    private instructorService: ProfileService,
    private loadingService: LoadingService,
    private webSocketService: WebSocketService,
    private employerService: EmployerServiceService,
    private router: Router
  ) {}

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  addLecture() {
    this.lectures.push({ title: '', file: null });
  }

  removeLecture(index: number) {
    this.lectures.splice(index, 1);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      if (index === -1) {
        // Handle new lecture file
        this.newLectureFile = file;
      } else {
        this.lectures[index].file = file;
      }
    }
  }

  saveCourse() {
    const files: File[] = [];
    const fileNames: string[] = [];
    this.newObject.courseCreatorId = this.userId as string;

    // Handle new lecture
    if (this.newLectureFile && this.newLectureTitle) {
      files.push(this.newLectureFile);
      fileNames.push(this.newLectureTitle);
    } else {
      console.error('New lecture title or file is missing');
      return;
    }

    for (const lecture of this.lectures) {
      if (lecture.file && lecture.title) {
        files.push(lecture.file);
        fileNames.push(lecture.title);
      } else {
        console.error('Lecture title or file is missing');
        return;
      }
    }

    // Show loading indicator
    this.loadingService.show();
    console.log('Loading started');
    this.instructorService.uploadCourse(files, fileNames, this.newObject).subscribe(
      response => {
        console.log('Upload successful:', response);
        // Hide loading indicator on success
        this.loadingService.hide();
        // Show success modal
        this.showSuccessModal = true;
        this.employerService.getEmployerList().subscribe(employers => {
          const adminIds = employers
            .filter(employer => employer.role === 'Admin')
            .map(employer => employer.staffId);
          adminIds.forEach(adminId => {
            this.webSocketService.sendMessageNotif(adminId, 'course created');
          });
        });
      },
      error => {
        this.loadingService.hide();
        console.error('Upload failed:', error);
      }
    );
  }

  redirectToCreationPage() {
    this.showSuccessModal = false;
    this.router.navigate(['/instructor/int-home']); // Adjust the route as needed
    // window.location.reload();
  }
}
