import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChataccListComponent } from './chatacc-list.component';

describe('ChataccListComponent', () => {
  let component: ChataccListComponent;
  let fixture: ComponentFixture<ChataccListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChataccListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChataccListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
