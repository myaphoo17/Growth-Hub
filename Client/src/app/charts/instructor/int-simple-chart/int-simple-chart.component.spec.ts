import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntSimpleChartComponent } from './int-simple-chart.component';

describe('IntSimpleChartComponent', () => {
  let component: IntSimpleChartComponent;
  let fixture: ComponentFixture<IntSimpleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntSimpleChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntSimpleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
