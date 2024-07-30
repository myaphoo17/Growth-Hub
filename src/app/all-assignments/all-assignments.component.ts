import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignmentService } from '../services/assignment.service';
import { Assignment } from '../models/assignment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-all-assignments',
  templateUrl: './all-assignments.component.html',
  styleUrls: ['./all-assignments.component.css']
})
export class AllAssignmentsComponent implements OnInit {
  assignmentForm: FormGroup;
  assignments: Assignment[] = [];
  courseId!: string;
  openMenuId: number | null = null; // Track the currently open menu
  courseIdencode!: string; 

  staffId: string = sessionStorage.getItem('userId') || '';
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role=sessionStorage.getItem('role');

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router
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
      this.courseId = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
      if (this.courseId) {
        this.loadAssignmentsByCourseId(this.courseId);
      } else {
        this.loadAssignments();
      }
    });
  }

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

  // navigateToAssignment(assignmentId: number) {
  //   this.router.navigate(['/student/student-assignment'], { queryParams: { assignmentId: assignmentId } });
  // }

  encodeId(id: string): string {
    return Base64.encode(id);
  }
  
  navigateToAssignment(assignmentId: number) {
    const baseRoute = this.role === 'Student' ? '/student' : '/instructor';
    this.router.navigate([`${baseRoute}/student-assignment`], { queryParams: { assignmentId: this.encodeId(assignmentId.toString()) } });
  }
  
}


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AssignmentService } from '../services/assignment.service';
// import { Assignment } from '../models/assignment.model';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Base64 } from 'js-base64';


// @Component({
//   selector: 'app-all-assignments',
//   templateUrl: './all-assignments.component.html',
//   styleUrls: ['./all-assignments.component.css']
// })
// export class AllAssignmentsComponent implements OnInit {
//   assignmentForm: FormGroup;
//   assignments: Assignment[] = [];
//   courseId!: string;
//   openMenuId: number | null = null; // Track the currently open menu
//   courseIdencode!: string; 
//  courseIdencode2!: string;

//   constructor(
//     private fb: FormBuilder,
//     private assignmentService: AssignmentService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.assignmentForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       dueDate: ['', Validators.required]
//     });
   
//   }

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.courseIdencode = params['courseId']; // Directly assign as string
//       this.courseId  = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
//     if (this.courseId) {
//       this.loadAssignmentsByCourseId(this.courseId);
//     } else {
//       this.loadAssignments();
//     }
//   }
//   )};
//   loadAssignmentsByCourseId(courseId: string) {
//     this.assignmentService.getAssignmentsByCourseId(courseId).subscribe(
//       data => {
//         this.assignments = data;
//       },
//       error => {
//         console.error('Error fetching assignments', error);
//       }
//     );
//   }

//   loadAssignments() {
//     this.assignmentService.getAssignments().subscribe(
//       data => {
//         this.assignments = data;
//       },
//       error => {
//         console.error('Error fetching assignments', error);
//       }
//     );
//   }

//   createAssignment() {
//     if (this.assignmentForm.valid) {
//       const formValue = this.assignmentForm.value;
//       const assignment: Assignment = {
//         ...formValue,
//         courseId: this.courseId,
//         dueDate: new Date(formValue.dueDate).toISOString().split('T')[0] // Format to yyyy-MM-dd
//       };
//       this.assignmentService.createInstructorAssignment(assignment).subscribe(
//         response => {
//           console.log('Assignment created successfully', response);
//           // Redirect or reset form after successful creation
//           this.router.navigate(['instructor/int-assignment'], { queryParams: { courseId: this.courseId } });
//           this.loadAssignmentsByCourseId(this.courseId); // Refresh assignments list
//         },
//         error => {
//           console.error('Error creating assignment', error);
//         }
//       );
//     }
//   }

//   toggleMenu(id?: number): void {
//     if (id !== undefined) {
//       this.openMenuId = this.openMenuId === id ? null : id;
//     }
//   }

//   isMenuOpen(id: number | undefined): boolean {
//     return this.openMenuId === id;
//   }

//   editAssignment(assignment: Assignment) {
//     if (assignment.id !== undefined) {
//       console.log('Edit assignment', assignment);
//     }
//   }

//   deleteAssignment(assignment: Assignment) {
//     if (assignment.id !== undefined) {
//       console.log('Delete assignment', assignment);
//     }
//   }
  
// }
