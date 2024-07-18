import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-int-assignment',
  templateUrl: './int-assignment.component.html',
  styleUrls: ['./int-assignment.component.css']
})
export class IntAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;

  constructor(private fb: FormBuilder, private assignmentService: AssignmentService) {
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  createAssignment() {
    if (this.assignmentForm.valid) {
      const formValue = this.assignmentForm.value;
      const assignment: Assignment = {
        ...formValue,
        dueDate: new Date(formValue.dueDate).toISOString().split('T')[0] // Format to yyyy-MM-dd
      };
      this.assignmentService.createInstructorAssignment(assignment).subscribe(
        response => {
          console.log('Assignment created successfully', response);
        },
        error => {
          console.error('Error creating assignment', error);
        }
      );
    }
  }
}
