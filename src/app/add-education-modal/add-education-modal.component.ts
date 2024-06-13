import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-education-modal',
  templateUrl: './add-education-modal.component.html',
  styleUrls: ['./add-education-modal.component.css']
})
export class AddEducationModalComponent {
  @ViewChild('dialog', { static: false }) dialog!: ElementRef;

  education = {
    institution: '',
    degree: '',
    startDate: '',
    graduationDate: ''
  };

  initialEducation = { ...this.education }; // Save the initial state for resetting

  institutions = ['Institution 1', 'Institution 2', 'Institution 3'];
  degrees = ['Degree 1', 'Degree 2', 'Degree 3'];

  onSave() {
    if (this.isFormValid()) {
      console.log('Education saved', this.education);
      // Save the education data
    } else {
      console.log('Form is not valid');
    }
  }

  onCancel() {
    this.education = { ...this.initialEducation }; // Reset the form data to initial state
    console.log('Form reset');
  }

  isFormValid() {
    return this.education.institution && this.education.degree && this.education.startDate && this.education.graduationDate;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dialog && !this.dialog.nativeElement.contains(event.target)) {
      this.onCancel();
    }
  }

  onDialogClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
