import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmNavBarComponent } from './adm-nav-bar.component';

describe('AdmNavBarComponent', () => {
  let component: AdmNavBarComponent;
  let fixture: ComponentFixture<AdmNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
