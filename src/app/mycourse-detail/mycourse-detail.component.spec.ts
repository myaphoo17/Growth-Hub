import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycourseDetailComponent } from './mycourse-detail.component';

describe('MycourseDetailComponent', () => {
  let component: MycourseDetailComponent;
  let fixture: ComponentFixture<MycourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MycourseDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MycourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
