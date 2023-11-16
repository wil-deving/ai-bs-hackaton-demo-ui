import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OamAssistantChatComponent } from './oam-assistant-chat.component';

describe('OamAssistantChatComponent', () => {
  let component: OamAssistantChatComponent;
  let fixture: ComponentFixture<OamAssistantChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OamAssistantChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OamAssistantChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
