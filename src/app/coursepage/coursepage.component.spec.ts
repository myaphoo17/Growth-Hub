import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursepageComponent } from './coursepage.component';

describe('CoursepageComponent', () => {
  let component: CoursepageComponent;
  let fixture: ComponentFixture<CoursepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
