import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDetailCourseComponent } from './update-detail-course.component';

describe('UpdateDetailCourseComponent', () => {
  let component: UpdateDetailCourseComponent;
  let fixture: ComponentFixture<UpdateDetailCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDetailCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDetailCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
