import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntMonthlyCourseAttendanceComponent } from './int-monthly-course-attendance.component';

describe('IntMonthlyCourseAttendanceComponent', () => {
  let component: IntMonthlyCourseAttendanceComponent;
  let fixture: ComponentFixture<IntMonthlyCourseAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntMonthlyCourseAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntMonthlyCourseAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
