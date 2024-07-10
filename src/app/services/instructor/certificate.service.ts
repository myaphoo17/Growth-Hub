import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = 'http://localhost:8080/api/certificates'; // Replace with your Spring Boot server URL

  constructor(private http: HttpClient) {}

  // Method to upload the certificate
  uploadCertificate(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Method to generate the PDF
  async generatePdf(templateFrameBytes: Uint8Array, studentName: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(templateFrameBytes);
    const pages = pdfDoc.getPages();
    const page = pages[0]; // Assuming the template frame has only one page
    const { width, height } = page.getSize();

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

    return await pdfDoc.save();
  }
}
