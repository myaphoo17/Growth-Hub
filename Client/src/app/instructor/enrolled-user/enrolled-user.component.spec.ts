import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledUserComponent } from './enrolled-user.component';

describe('EnrolledUserComponent', () => {
  let component: EnrolledUserComponent;
  let fixture: ComponentFixture<EnrolledUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolledUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
