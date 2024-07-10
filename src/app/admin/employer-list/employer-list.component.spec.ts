import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployersListComponent } from './employer-list.component';

describe('EmployerListComponent', () => {
  let component: EmployersListComponent;
  let fixture: ComponentFixture<EmployersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
