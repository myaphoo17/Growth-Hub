// instructor-profile-card.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEducationModalComponent } from '../add-education-modal/add-education-modal.component';
import { Education } from './education.model';

@Component({
  selector: 'app-instructor-profile-card',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  educations: Education[] = [
    {
      institution: 'Some University',
      degree: 'Bachelor of Science',
      startDate: '09/2015',
      graduationDate: '06/2019',
    },
    {
      institution: 'Another University',
      degree: 'Master of Science',
      startDate: '09/2019',
      graduationDate: '06/2021',
    }
  ];

  constructor(public dialog: MatDialog) {}

  openAddEducationDialog(): void {
    const dialogRef = this.dialog.open(AddEducationModalComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((result: Education) => {
      if (result) {
        this.addEducation(result);
      }
    });
  }

  addEducation(education: Education): void {
    this.educations.push(education);
  }

  editEducation(education: Education): void {
    // Logic for editing education
  }
}
