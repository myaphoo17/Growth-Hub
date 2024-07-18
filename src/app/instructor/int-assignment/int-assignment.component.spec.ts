import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntAssignmentComponent } from './int-assignment.component';

describe('IntAssignmentComponent', () => {
  let component: IntAssignmentComponent;
  let fixture: ComponentFixture<IntAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
