import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../services/certificate.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64'; // Import Base64 library
import { SecurityContext } from '@angular/core';
import { CertificateResultModel } from '../../models/instructor/certificate-result.models';


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
  courseId: number = 0;
  staffIds: string[] = [];
  status: string = 'Pass';  // Example status
  certificateResult: CertificateResultModel = {
    certificateId: 0,
    staffId: '',
    courseId: 0,
    status: '',
    grade: '',
    staffName: '',
    courseName: '',
    image: ''
  };

  constructor(private route: ActivatedRoute, private certificateService: CertificateService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encodedCourseId = params['courseId'];
      if (encodedCourseId) {
        const decodedCourseId = Base64.decode(encodedCourseId);
        this.courseId = Number(decodedCourseId); // Convert to number
        console.log("CourseID:", this.courseId);
        this.fetchStaffIds();
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

  fetchStaffIds(): void {
    this.certificateService.getStaffIds(this.courseId, this.status)
      .subscribe(
        data => {
          this.staffIds = data;
          console.log("staffId :", this.staffIds);
        },
        error => {
          console.error('Error fetching staff IDs', error);
        }
      );
  }

  // onCertificateClick(clickedCertificate: any): void {
  //   // Deselect all certificates
  //   this.certificates.forEach(certificate => {
  //     certificate.selected = false;
  //   });

  //   // Select the clicked certificate
  //   clickedCertificate.selected = true;
  //   this.selectedCertificateId = clickedCertificate.id;
  //   console.log(this.selectedCertificateId, 'selected');

  //   // Fetch and display staffName, courseName, and grade for each staff_id
  //   this.staffIds.forEach(staffId => {
  //     this.certificateService.getExamResultsWithDetails([staffId], this.courseId, 'Pass').subscribe(
  //       examResult => {
  //         console.log(`Fetched examResult for staffId ${staffId}:`, examResult);
  //         if (examResult && examResult.status === 'Pass') {
  //           // Place the data on the image or anywhere in the component as needed
  //           // Example: Displaying in console
  //           console.log(`Staff Name: ${examResult.staffName}, Course Name: ${examResult.courseName}, Grade: ${examResult.grade}`);
  //         }
  //       },
  //       error => {
  //         console.error(`Error fetching exam result for staffId ${staffId}:`, error);
  //       }
  //     );
  //   });
  // }

  onCertificateClick(clickedCertificate: any): void {
    // Deselect all certificates
    this.certificates.forEach(certificate => {
        certificate.selected = false;
    });

    // Select the clicked certificate
    clickedCertificate.selected = true;
    this.selectedCertificateId = clickedCertificate.id;
    console.log(this.selectedCertificateId, 'selected');

    // Fetch and display staffName, courseName, and grade for each staff_id
    const uniqueStaffIds = Array.from(new Set(this.staffIds)); // Remove duplicates

    uniqueStaffIds.forEach(staffId => {
        this.certificateService.getExamResultsWithDetails([staffId], this.courseId).subscribe(
            examResult => {
                console.log(`Fetched examResult for staffId ${staffId}:`, examResult);
                if (examResult && examResult.status === 'Pass') {
                    // Place the data on the image or anywhere in the component as needed
                    // Example: Displaying in console
                    console.log(`Staff Name: ${examResult.staffName}, Course Name: ${examResult.courseName}, Grade: ${examResult.grade}`);
                }
            },
            error => {
                console.error(`Error fetching exam result for staffId ${staffId}:`, error);
            }
        );
    });
}

onSave(clickedCertificate: any): void {
  const courseId = this.courseId;
  const uniqueStaffIds = Array.from(new Set(this.staffIds)); // Remove duplicates

  uniqueStaffIds.forEach(staffId => {
    this.certificateService.getExamResultsWithDetails([staffId], courseId).subscribe(
      examResult => {
        console.log(`Fetched examResult for staffId ${staffId}: `, examResult);

        if (examResult) {
          const staffName = examResult.staffNames[staffId];
          const courseName = examResult.courseName;
          const grade = examResult.results.length > 0 ? examResult.results[0].grade : ''; // Adjust based on your actual data structure

          // Ensure certificateId is not null
          const certificateId = this.selectedCertificateId !== null ? this.selectedCertificateId : 0;

          // Convert SafeUrl to string
          const imageUrl = this.imageUrls[clickedCertificate.id] ? this.sanitizer.sanitize(SecurityContext.URL, this.imageUrls[clickedCertificate.id]) : '';

          this.certificateResult = {
            staffId: staffId,
            courseId: courseId,
            certificateId: certificateId,
            status: 'Pass',
            grade: grade,
            staffName: staffName,
            courseName: courseName,
            image: imageUrl || '' // Ensure image is a string
          };

          console.log('Certificate result to be saved:', this.certificateResult);

          this.certificateService.saveCertificateResult(this.certificateResult).subscribe(
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
  });
}




  // onSave(clickedCertificate: any): void {
  //   const courseId = this.courseId;
  //   const staffIds = this.staffIds;

  //   console.log("CourseID:", this.courseId);
  //   console.log("StaffID:", this.staffIds);

  //   staffIds.forEach(staffId => {
  //     this.certificateService.getExamResultsWithDetails([staffId], courseId, 'Pass').subscribe(
  //       examResult => {
  //         console.log('Fetched examResult:', examResult);

  //         if (examResult && examResult.status === 'Pass') {
  //           const certificateResult = {
  //             staffId: staffId,
  //             courseId: examResult.courseId,
  //             certificateId: this.selectedCertificateId,
  //             status: 'Pass',
  //             grade: examResult.grade,
  //             staffName: examResult.staffName,
  //             courseName: examResult.courseName,
  //             image: this.imageUrls[clickedCertificate.id] // Assuming the image is stored as a URL
  //           };

  //           this.certificateService.saveCertificateData(certificateResult).subscribe(
  //             response => {
  //               // Handle success
  //               console.log('Certificate data saved successfully:', response);
  //             },
  //             error => {
  //               // Handle error
  //               console.error('Error saving certificate data:', error);
  //             }
  //           );
  //         } else {
  //           console.error('Exam result is null or does not have status "Pass":', examResult);
  //         }
  //       },
  //       error => {
  //         // Handle error fetching exam result
  //         console.error('Error fetching exam result:', error);
  //       }
  //     );
  //   });
  // }

  onCancel(clickedCertificate: any): void {
    console.log('Cancel button clicked');
    this.certificates.forEach(certificate => {
      certificate.selected = false;
    });
    this.selectedCertificateId = null;
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CertificateService } from '../../services/certificate.service';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { ActivatedRoute } from '@angular/router';
// import { Base64 } from 'js-base64'; // Import Base64 library

// interface Frame {
//   src: string;
//   selected: boolean;
// }

// @Component({
//   selector: 'app-all-certificates',
//   templateUrl: './all-certificates.component.html',
//   styleUrls: ['./all-certificates.component.css']
// })
// export class AllCertificatesComponent implements OnInit {

//   certificates: any[] = [];
//   imageUrls: { [key: number]: SafeUrl } = {};
//   frames: Frame[] = [];
//   selectedCertificateId: number | null = null;
//   passedExamResults: any[] = [];
//   courseId: number = 0;
//   staffIds: string[] = [];
//   status: string = 'Pass';  // Example status
//   certificateResults: any[] = []; // Array to store results for display

//   constructor(
//     private route: ActivatedRoute,
//     private certificateService: CertificateService,
//     private sanitizer: DomSanitizer
//   ) { }

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const encodedCourseId = params['courseId'];
//       if (encodedCourseId) {
//         const decodedCourseId = Base64.decode(encodedCourseId);
//         this.courseId = Number(decodedCourseId); // Convert to number
//         console.log("CourseID:", this.courseId);
//         this.fetchStaffIds();
//       }
//     });
//     this.loadCertificates();
//     this.loadPassedExamResults();
//   }

//   loadCertificates(): void {
//     const instructorId = this.certificateService.getLoggedInUserStaffId();
//     this.certificateService.getCertificatesByInstructorId(instructorId).subscribe(certificates => {
//       this.certificates = certificates;

//       this.certificates.forEach(certificate => {
//         this.certificateService.getImage(certificate.id).subscribe(data => {
//           const objectURL = URL.createObjectURL(data);
//           this.imageUrls[certificate.id] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//           certificate.selected = false; // Initialize selected property
//         });
//       });
//     });
//   }

//   loadPassedExamResults(): void {
//     this.certificateService.getPassedExamResults().subscribe({
//       next: (data) => {
//         this.passedExamResults = data;
//       },
//       error: (error) => {
//         console.error('Error fetching exam results:', error);
//       }
//     });
//   }

//   fetchStaffIds(): void {
//     this.certificateService.getStaffIds(this.courseId, this.status).subscribe(
//       data => {
//         this.staffIds = data;
//         console.log("staffId:", this.staffIds);
//       },
//       error => {
//         console.error('Error fetching staff IDs', error);
//       }
//     );
//   }

//   onCertificateClick(clickedCertificate: any): void {
//     // Deselect all certificates
//     this.certificates.forEach(certificate => {
//       certificate.selected = false;
//     });

//     // Select the clicked certificate
//     clickedCertificate.selected = true;
//     this.selectedCertificateId = clickedCertificate.id;
//     console.log(this.selectedCertificateId, 'selected');

//     // Fetch and display exam results
//     this.fetchAndDisplayExamResults();
//   }

//   fetchAndDisplayExamResults(): void {
//     if (this.selectedCertificateId === null) {
//       console.error('No certificate selected');
//       return;
//     }

//     const courseId = this.courseId;
//     const staffIds = this.staffIds;

//     this.certificateService.getExamResultsWithDetails(staffIds, courseId, 'Pass').subscribe(
//       examResults => {
//         console.log('Fetched examResults:', examResults);
//         const results = examResults.results;
//         const courseName = examResults.courseName;
//         const staffNames = examResults.staffNames;

//         this.certificateResults = results.map((result: any) => ({
//           staffId: result.staffId,
//           courseId: courseId,
//           certificateId: this.selectedCertificateId!,
//           status: 'Pass',
//           grade: result.grade,
//           staffName: staffNames[result.staffId],
//           courseName: courseName,
//           image: this.imageUrls[this.selectedCertificateId!]
//         }));
//       },
//       error => {
//         console.error('Error fetching exam results:', error);
//       }
//     );
//   }

//   onSave(): void {
//     if (this.selectedCertificateId === null) {
//       console.error('No certificate selected');
//       return;
//     }

//     const courseId = this.courseId;
//     const staffIds = this.staffIds;

//     console.log("CourseID:", this.courseId);
//     console.log("StaffID:", this.staffIds);
//     this.certificateService.getExamResultsWithDetails(staffIds, courseId, 'Pass').subscribe(
//       examResults => {
//         console.log('Fetched examResults:', examResults);
//         const results = examResults.results;
//         const courseName = examResults.courseName;
//         const staffNames = examResults.staffNames;

//         results.forEach((result: any) => {
//           const certificateResult = {
//             staffId: result.staffId,
//             courseId: courseId,
//             certificateId: this.selectedCertificateId!,
//             status: 'Pass',
//             grade: result.grade,
//             staffName: staffNames[result.staffId],
//             courseName: courseName,
//             image: this.imageUrls[this.selectedCertificateId!]
//           };

//           this.certificateService.saveCertificateData(certificateResult).subscribe(
//             response => {
//               console.log('Certificate data saved successfully:', response);
//             },
//             error => {
//               console.error('Error saving certificate data:', error);
//             }
//           );
//         });
//       },
//       error => {
//         console.error('Error fetching exam results:', error);
//       }
//     );
//   }

//   onCancel(): void {
//     console.log('Cancel button clicked');
//     this.certificates.forEach(certificate => {
//       certificate.selected = false;
//     });
//     this.selectedCertificateId = null;
//   }
// }


