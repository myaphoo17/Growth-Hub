import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntAnalysisComponent } from './int-analysis.component';

describe('IntAnalysisComponent', () => {
  let component: IntAnalysisComponent;
  let fixture: ComponentFixture<IntAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
