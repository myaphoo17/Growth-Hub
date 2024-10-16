import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHasBeenCertificateComponent } from './student-has-been-certificate.component';

describe('StudentHasBeenCertificateComponent', () => {
  let component: StudentHasBeenCertificateComponent;
  let fixture: ComponentFixture<StudentHasBeenCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentHasBeenCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHasBeenCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
