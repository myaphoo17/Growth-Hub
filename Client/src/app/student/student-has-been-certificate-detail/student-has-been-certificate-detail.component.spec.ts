import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHasBeenCertificateDetailComponent } from './student-has-been-certificate-detail.component';

describe('StudentHasBeenCertificateDetailComponent', () => {
  let component: StudentHasBeenCertificateDetailComponent;
  let fixture: ComponentFixture<StudentHasBeenCertificateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentHasBeenCertificateDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHasBeenCertificateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
