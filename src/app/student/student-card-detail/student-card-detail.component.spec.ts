import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCardDetailComponent } from './student-card-detail.component';

describe('StudentCardDetailComponent', () => {
  let component: StudentCardDetailComponent;
  let fixture: ComponentFixture<StudentCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentCardDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
