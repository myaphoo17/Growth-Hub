import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerKeyInstructorComponent } from './answer-key-instructor.component';

describe('AnswerKeyInstructorComponent', () => {
  let component: AnswerKeyInstructorComponent;
  let fixture: ComponentFixture<AnswerKeyInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswerKeyInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerKeyInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
