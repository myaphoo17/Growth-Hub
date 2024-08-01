import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAllAssignmentComponent } from './student-all-assignment.component';

describe('StudentAllAssignmentComponent', () => {
  let component: StudentAllAssignmentComponent;
  let fixture: ComponentFixture<StudentAllAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAllAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAllAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
