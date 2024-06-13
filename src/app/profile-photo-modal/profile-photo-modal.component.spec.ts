import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePhotoModalComponent } from './profile-photo-modal.component';

describe('ProfilePhotoModalComponent', () => {
  let component: ProfilePhotoModalComponent;
  let fixture: ComponentFixture<ProfilePhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilePhotoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilePhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
