import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Education } from './education.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  private educations: Education[] = []; // Use the Education interface

  constructor() { }

  getEducations(): Observable<Education[]> {
    return of(this.educations);
  }

  addEducation(education: Education): Observable<void> {
    this.educations.push(education);
    return of();
  }


  private profile = {
    name: 'yupaing moe',
    picture: 'path/to/profile-picture.jpg' // Change this to the actual path of the profile picture
  };

  getProfile() {
    return this.profile;
  }

  updateProfilePicture(newPicture: string) {
    this.profile.picture = newPicture;
  }

  removeProfilePicture() {
    this.profile.picture = 'path/to/default-picture.jpg'; // Path to a default picture or placeholder
  }
}
