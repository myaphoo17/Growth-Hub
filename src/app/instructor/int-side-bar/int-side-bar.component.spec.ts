import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntSideBarComponent } from './int-side-bar.component';

describe('IntSideBarComponent', () => {
  let component: IntSideBarComponent;
  let fixture: ComponentFixture<IntSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntSideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
