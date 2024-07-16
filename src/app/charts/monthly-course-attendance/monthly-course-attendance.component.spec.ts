import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCourseAttendanceComponent } from './monthly-course-attendance.component';

describe('MonthlyCourseAttendanceComponent', () => {
  let component: MonthlyCourseAttendanceComponent;
  let fixture: ComponentFixture<MonthlyCourseAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyCourseAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCourseAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
