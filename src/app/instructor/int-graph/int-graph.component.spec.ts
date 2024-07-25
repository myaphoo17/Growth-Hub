import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntGraphComponent } from './int-graph.component';

describe('IntGraphComponent', () => {
  let component: IntGraphComponent;
  let fixture: ComponentFixture<IntGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
