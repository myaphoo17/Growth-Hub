import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDFDocument, rgb, StandardFonts, PDFImage } from 'pdf-lib';
import { map } from 'rxjs/operators';
import { ExamResultModel } from '../models/instructor/exam-result'; // Adjust the path if necessary



@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = 'http://localhost:8080/api/certificates'; // Replace with your Spring Boot server URL
  private resultApiUrl = 'http://localhost:8080/api/certificate-results'; // Endpoint for certificate results
  private baseUrl = 'http://localhost:8080/exam-results';


  constructor(private http: HttpClient) {}

  uploadMultipleCertificates(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploadMultiple`, formData);
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  getAllCertificates(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCertificatesByInstructorId(instructorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/${instructorId}`);
  }

  getLoggedInUserStaffId(): string {
    return sessionStorage.getItem('userId') || '';
  }

  getStaffIdsByCourseId(courseId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.resultApiUrl}/staff/${courseId}`);
  }

  getExamResultByStaffIdAndCourseId(staffId: string[], courseId: number): Observable<ExamResultModel> {
    return this.http.get<ExamResultModel>(`${this.resultApiUrl}/result?staffId=${staffId}&courseId=${courseId}`);
  }
  
  saveCertificateData(certificateResult: any): Observable<any> {
    return this.http.post<any>(`${this.resultApiUrl}/save-certificate-data`, certificateResult);
  }
   
  getPassedExamResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      map(results => results.filter(result => result.status === 'Pass'))
    );
  }

  async generateCertificateImage(templateFrameBytes: Uint8Array, studentName: string, imageType: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    let image: PDFImage;
    if (imageType === 'image/png') {
        image = await pdfDoc.embedPng(templateFrameBytes);
    } else if (imageType === 'image/jpeg') {
        image = await pdfDoc.embedJpg(templateFrameBytes);
    } else {
        throw new Error('Unsupported image type');
    }

    page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
    });

    const fontSize = 30;
    const text = studentName;
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const textWidth = timesRomanFont.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}
