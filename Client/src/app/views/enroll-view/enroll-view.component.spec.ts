import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollViewComponent } from './enroll-view.component';

describe('EnrollViewComponent', () => {
  let component: EnrollViewComponent;
  let fixture: ComponentFixture<EnrollViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
