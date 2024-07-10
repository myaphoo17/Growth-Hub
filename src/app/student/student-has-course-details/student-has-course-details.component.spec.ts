import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHasCourseDetailsComponent } from './student-has-course-details.component';

describe('StudentHasCourseDetailsComponent', () => {
  let component: StudentHasCourseDetailsComponent;
  let fixture: ComponentFixture<StudentHasCourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentHasCourseDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentHasCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
