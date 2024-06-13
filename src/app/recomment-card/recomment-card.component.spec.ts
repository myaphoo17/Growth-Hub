import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommentCardComponent } from './recomment-card.component';

describe('RecommentCardComponent', () => {
  let component: RecommentCardComponent;
  let fixture: ComponentFixture<RecommentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
