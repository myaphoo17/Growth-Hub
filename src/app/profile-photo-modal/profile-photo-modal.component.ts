import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

  
  @Component({
    selector: 'app-profile-photo-modal',
    templateUrl: './profile-photo-modal.component.html',
    styleUrls: ['./profile-photo-modal.component.css']
  })
  export class ProfilePhotoModalComponent {
    @Input() profile: any;
    @Output() close = new EventEmitter<void>();
  
    constructor(@Inject(ProfileService) private profileService: ProfileService) {}
  
    closeModal() {
      this.close.emit();
    }
  
    changePhoto() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
  
      input.onchange = () => {
        const file = input.files?.[0]; // Use optional chaining to handle possible null value
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const newPicture = e.target.result;
            this.profileService.updateProfilePicture(newPicture);
            this.profile.picture = newPicture; // Update the local profile picture
          };
          reader.readAsDataURL(file);
        } else {
          console.error('No file selected');
        }
      };
  
      input.click();
    }
  
    removePhoto() {
      this.profileService.removeProfilePicture();
      this.profile.picture = this.profileService.getProfile().picture; // Update the local profile picture
    }
  }
  