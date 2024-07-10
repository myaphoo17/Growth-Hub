import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationHomeComponent } from './creation-home.component';

describe('CreationHomeComponent', () => {
  let component: CreationHomeComponent;
  let fixture: ComponentFixture<CreationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
