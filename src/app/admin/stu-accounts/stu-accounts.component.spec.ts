import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuAccountsComponent } from './stu-accounts.component';

describe('StuAccountsComponent', () => {
  let component: StuAccountsComponent;
  let fixture: ComponentFixture<StuAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StuAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StuAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
