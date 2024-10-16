import { Component } from '@angular/core';
import { CertificateService } from '../../services/certificate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Frame {
  file: File;
  src: string;
}

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent {
  frames: Frame[] = [];

  constructor(
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer
  ) {}

  onAddFrameClick() {
    const fileInput = document.getElementById('frameUpload') as HTMLInputElement;
    fileInput.click();
  }

  onFrameFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.frames.push({
          file: file,
          src: e.target.result
        });
      };
      reader.readAsDataURL(file);

      // Clear the input value to allow re-upload of the same file if removed
      const fileInput = event.target as HTMLInputElement;
      fileInput.value = '';
    }
  }

  removeFrame(index: number) {
    this.frames.splice(index, 1);
  }

  onAddButtonClick() {
    const formData = new FormData();
    this.frames.forEach((frame, index) => {
      formData.append('file', frame.file); // Adjusted key to match backend expectation
    });

    const instructorId = this.certificateService.getLoggedInUserStaffId();
    formData.append('instructorId', instructorId);

    this.certificateService.uploadMultipleCertificates(formData).subscribe(
      response => {
        console.log('Certificates uploaded successfully', response);
      },
      error => {
        console.error('Error uploading certificates', error);
      }
    );
  }
}
