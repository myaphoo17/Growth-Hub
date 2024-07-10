import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstAccountsComponent } from './inst-accounts.component';

describe('InstAccountsComponent', () => {
  let component: InstAccountsComponent;
  let fixture: ComponentFixture<InstAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
