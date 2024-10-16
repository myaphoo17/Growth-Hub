
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

// Custom Validator for Due Date
export function dueDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare dates without time

    if (selectedDate < today) {
      return { invalidDueDate: true };
    }
    return null;
  };
}

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
      // dueDate: ['', Validators.required]
      dueDate: ['', [Validators.required, dueDateValidator()]] // Apply custom validator here
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
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1a008f',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!'
      }).then((result) => {
        if (result.isConfirmed) {
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
  
              // Reset the form after successful creation
              this.assignmentForm.reset();
  
              // Optionally, set default values if necessary
              this.assignmentForm.patchValue({
                dueDate: ''
              });
  
              // Redirect or refresh assignments list
              this.router.navigate(['instructor/int-assignment'], { queryParams: { courseId: this.encodeId(this.courseId) } });
              this.loadAssignmentsByCourseId(this.courseId); // Refresh assignments list
            },
            error => {
              console.error('Error creating assignment', error);
            }
          );
        }
      });
    }
  }
  
  
  toggleMenu(id?: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Prevent click event from propagating to the card
    }
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
  }deleteAssignment(assignment: Assignment) {
  if (assignment.id !== undefined) {
    this.assignmentService.deleteInstructorAssignment(assignment.id).subscribe(
      () => {
        this.snackBar.open('Assignment deleted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        // Remove the deleted assignment from the list
        this.assignments = this.assignments.filter(a => a.id !== assignment.id);
        // Reload assignments to ensure the list is up-to-date
        this.loadAssignmentsByCourseId(this.courseId);
        // Navigate back to 'int-assignment' component
      this.router.navigate(['instructor/int-assignment'], { queryParams: { courseId: this.encodeId(this.courseId) } });
      },
      error => {
        console.error('Error deleting assignment', error);
      }
    );
  } else {
    console.error('Attempted to delete an assignment without a valid ID');
  }
}

  
  viewAssignmentDetails(assignmentId: number): void {
    const encodedAssignmentId = this.encodeId(assignmentId.toString());
    this.router.navigate(['instructor/int-assignment/student-all-assignment'], { queryParams: { assignmentId: encodedAssignmentId } });
  }
  
  
}
