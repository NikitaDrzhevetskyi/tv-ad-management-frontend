import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAssignmentDialogComponent } from './agent-assignment-dialog.component';

describe('AgentAssignmentDialogComponent', () => {
  let component: AgentAssignmentDialogComponent;
  let fixture: ComponentFixture<AgentAssignmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentAssignmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
