import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFormDialogComponent } from './agent-form-dialog.component';

describe('AgentFormDialogComponent', () => {
  let component: AgentFormDialogComponent;
  let fixture: ComponentFixture<AgentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
