import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewCourseComponent } from './student-view-course.component';

describe('StudentViewCourseComponent', () => {
  let component: StudentViewCourseComponent;
  let fixture: ComponentFixture<StudentViewCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentViewCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentViewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
