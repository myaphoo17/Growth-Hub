import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../services/certificate.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64'; // Import Base64 library

interface Frame {
  src: string;
  selected: boolean;
}

@Component({
  selector: 'app-all-certificates',
  templateUrl: './all-certificates.component.html',
  styleUrls: ['./all-certificates.component.css']
})
export class AllCertificatesComponent implements OnInit {

  certificates: any[] = [];
  imageUrls: { [key: number]: SafeUrl } = {};
  frames: Frame[] = [];
  selectedCertificateId: number | null = null;
  passedExamResults: any[] = [];
  courseId: number=0;
  staffIds: string[] = [];


  constructor(private route: ActivatedRoute,private certificateService: CertificateService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encodedCourseId = params['courseId'];
      if (encodedCourseId) {
        const decodedCourseId = Base64.decode(encodedCourseId);
        this.courseId = Number(decodedCourseId); // Convert to number
        console.log("CourseID:", this.courseId);
        this.fetchStaffIds(this.courseId);
      }
    });
    this.loadCertificates();
    this.loadPassedExamResults();
  }

  loadCertificates(): void {
    const instructorId = this.certificateService.getLoggedInUserStaffId();
    this.certificateService.getCertificatesByInstructorId(instructorId).subscribe(certificates => {
      this.certificates = certificates;

      this.certificates.forEach(certificate => {
        this.certificateService.getImage(certificate.id).subscribe(data => {
          const objectURL = URL.createObjectURL(data);
          this.imageUrls[certificate.id] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          certificate.selected = false; // Initialize selected property
        });
      });
    });
  }

  loadPassedExamResults(): void {
    this.certificateService.getPassedExamResults().subscribe({
      next: (data) => {
        this.passedExamResults = data;
      },
      error: (error) => {
        console.error('Error fetching exam results:', error);
      }
    });
  }
  fetchStaffIds(courseId: number): void {
    this.certificateService.getStaffIdsByCourseId(courseId).subscribe(
      (data: string[]) => {
        this.staffIds = data;
      },
      error => {
        console.error('Error fetching staff IDs', error);
      }
    );
  }


  onCertificateClick(clickedCertificate: any): void {
    // Deselect all certificates
    this.certificates.forEach(certificate => {
      certificate.selected = false;
    });

    // Select the clicked certificate
    clickedCertificate.selected = true;
    this.selectedCertificateId = clickedCertificate.id;
    console.log(this.selectedCertificateId, 'selected');
    // Handle additional logic here if needed
  }

  onSave(clickedCertificate: any): void {
    const courseId =this.courseId; // Replace with actual courseId from you context
    const staffIds = this.staffIds;

    console.log("CourseID :", this.courseId);
    console.log("StaffID :", this.staffIds);
    this.certificateService.getExamResultByStaffIdAndCourseId(staffIds, courseId).subscribe(
      examResult => {
        console.log('Fetched examResult:', examResult);
  
        if (examResult && examResult.status === 'Pass') {
          const certificateResult = {
            staffIds: staffIds,
            courseId: examResult.courseId,
            certificateId: this.selectedCertificateId,
            status: 'Pass',
            grade: examResult.grade,
            // staffName: examResult.staffName,
            // courseName: examResult.courseName
          };
  
          this.certificateService.saveCertificateData(certificateResult).subscribe(
            response => {
              // Handle success
              console.log('Certificate data saved successfully:', response);
            },
            error => {
              // Handle error
              console.error('Error saving certificate data:', error);
            }
          );
        } else {
          console.error('Exam result is null or does not have status "Pass":', examResult);
        }
      },
      error => {
        // Handle error fetching exam result
        console.error('Error fetching exam result:', error);
      }
    );
  }
  
  
  
  onCancel(clickedCertificate: any): void {
    console.log('Cancel button clicked');
    this.certificates.forEach(certificate => {
      certificate.selected = false;
    });
    this.selectedCertificateId = null;
  }
}