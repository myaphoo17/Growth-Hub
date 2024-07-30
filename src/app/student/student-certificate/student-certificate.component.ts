import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../../services/certificate.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CertificateResultModel } from '../../models/instructor/certificate-result.models';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-student-certificate',
  templateUrl: './student-certificate.component.html',
  styleUrls: ['./student-certificate.component.css']
})
export class StudentCertificateComponent implements OnInit {
  certificates: CertificateResultModel[] = [];
  imageUrls: { [key: number]: SafeUrl } = {}; 
  courseIdencode!:string;
  staffIdencode!:string;
  courseId!:number;
  staffId!:string;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId'];
      this.staffIdencode = params['staffId'];
      const decodedCourseId = Base64.decode(decodeURIComponent(this.courseIdencode));
      this.courseId = isNaN(Number(decodedCourseId)) ? NaN : Number(decodedCourseId);
      this.staffId = Base64.decode(decodeURIComponent(this.staffIdencode));
  
      if (!isNaN(this.courseId) && this.staffId) {
        this.fetchCertificates(this.courseId, this.staffId);
      }
    });
  }
  

  fetchCertificates(courseId: number, staffId: string): void {
    this.certificateService.getCertificateByCourseIdAndStaffId(courseId, staffId).subscribe(certificates => {
      // Ensure certificates are unique
      const uniqueCertificateIds = Array.from(new Set(certificates.map(c => c.certificateId)));
      const uniqueCertificates = uniqueCertificateIds
        .map(id => certificates.find(c => c.certificateId === id))
        .filter((c): c is CertificateResultModel => c !== undefined);

      this.certificates = uniqueCertificates;
      this.certificates.forEach(certificate => this.loadCertificateImage(certificate.certificateId));
    });
  }

  loadCertificateImage(certificateId: number): void {
    if (this.imageUrls[certificateId]) {
      return; // Image already loaded
    }

    this.certificateService.getCertificateImage(certificateId).subscribe(base64Image => {
      const dataUrl = `data:image/png;base64,${base64Image}`;
      this.imageUrls[certificateId] = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    });
    
  }
}