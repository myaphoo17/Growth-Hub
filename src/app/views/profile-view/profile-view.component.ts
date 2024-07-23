import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/instructor/profile.service';
import { Employer } from '../../models/admin/employer';
import { Education } from '../../models/instructor/education.model';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  staffIdProfile: string = '';
  instructorData: Employer = {} as Employer;
  educations: Education[] = [];
  private refreshInterval: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private instructorService: ProfileService, 
    private route: ActivatedRoute // Inject ActivatedRoute to get route parameters
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const encodedId = params.get('staffId');
          this.staffIdProfile = encodedId ? Base64.decode(encodedId) : '';
          // Fetch instructor profile and then get education
          return this.instructorService.getInstructorProfileById(this.staffIdProfile);
        })
      ).subscribe({
        next: (instructorData: Employer) => {
          this.instructorData = instructorData;
          this.getEducation(); // Fetch education after instructor data is received
        },
        error: (e) => console.error(e),
      })
    );

    this.refreshInterval = setInterval(() => {
      this.instructorProfile();
      this.getEducation();
    }, 10000); // Adjust the interval as needed
  } 

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.subscription.unsubscribe(); // Clean up subscriptions
  }

  instructorProfile(): void {
    this.instructorService.getInstructorProfileById(this.staffIdProfile).subscribe({
      next: (data: Employer) => {
        this.instructorData = data;
        this.getEducation(); // Fetch education data after refreshing profile
      },
      error: (e) => console.error(e),
    });
  }

  getEducation(): void {
    if (this.instructorData.sr) {
      this.instructorService.getEducations(this.instructorData.sr.toString()).subscribe({
        next: (data: Education[]) => {
          this.educations = data;
        },
        error: (e) => console.error(e),
      });
    }
  }

  shareProfileLink(): void {
    const profileUrl = `${window.location.origin}/profile/${Base64.encode(this.staffIdProfile)}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl).then(() => {
        alert('Profile link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy profile link: ', err);
        alert('Failed to copy profile link.');
      });
    } else {
      // Fallback if clipboard API is not supported
      const textarea = document.createElement('textarea');
      textarea.value = profileUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Profile link copied to clipboard!');
    }
  }
}
