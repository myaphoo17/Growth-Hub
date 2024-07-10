import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapproveCoursesComponent } from './unapprove-courses.component';

describe('UnapproveCoursesComponent', () => {
  let component: UnapproveCoursesComponent;
  let fixture: ComponentFixture<UnapproveCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnapproveCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnapproveCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
