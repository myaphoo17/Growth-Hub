import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamViewAdminComponent } from './exam-view-admin.component';

describe('ExamViewAdminComponent', () => {
  let component: ExamViewAdminComponent;
  let fixture: ComponentFixture<ExamViewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamViewAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
