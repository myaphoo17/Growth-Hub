
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-int-assignment',
  templateUrl: './int-assignment.component.html',
  styleUrls: ['./int-assignment.component.css']
})
export class IntAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;
  assignments: Assignment[] = [];
  courseId!: string;
  openMenuId: number | null = null; // Track the currently open menu
  courseIdencode!: string; 
  courseIdencode2!: string;

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
   
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId']; // Directly assign as string
      this.courseId  = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
    if (this.courseId) {
      this.loadAssignmentsByCourseId(this.courseId);
    } else {
      this.loadAssignments();
    }
  }
  )};
  loadAssignmentsByCourseId(courseId: string) {
    this.assignmentService.getAssignmentsByCourseId(courseId).subscribe(
      data => {
        this.assignments = data;
      },
      error => {
        console.error('Error fetching assignments', error);
      }
    );
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  loadAssignments() {
    this.assignmentService.getAssignments().subscribe(
      data => {
        this.assignments = data;
      },
      error => {
        console.error('Error fetching assignments', error);
      }
    );
  }

  createAssignment() {
    if (this.assignmentForm.valid) {
      const formValue = this.assignmentForm.value;
      const assignment: Assignment = {
        ...formValue,
        courseId: this.courseId,
        dueDate: new Date(formValue.dueDate).toISOString().split('T')[0] // Format to yyyy-MM-dd
      };
      this.assignmentService.createInstructorAssignment(assignment).subscribe(
        response => {
          this.snackBar.open('Assignment created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          console.log('Assignment created successfully', response);
          // Redirect or reset form after successful creation
          this.router.navigate(['instructor/int-assignment'], { queryParams: { courseId: this.encodeId(this.courseId) } });
          this.loadAssignmentsByCourseId(this.courseId); // Refresh assignments list
        },
        error => {
          console.error('Error creating assignment', error);
        }
      );
    }
  }

  toggleMenu(id?: number): void {
    if (id !== undefined) {
      this.openMenuId = this.openMenuId === id ? null : id;
    }
  }

  isMenuOpen(id: number | undefined): boolean {
    return this.openMenuId === id;
  }

  editAssignment(assignment: Assignment) {
    if (assignment.id !== undefined) {
      console.log('Edit assignment', assignment);
    }
  }

  deleteAssignment(assignment: Assignment) {
    if (assignment.id !== undefined) {
      console.log('Delete assignment', assignment);
    }
  }
}
