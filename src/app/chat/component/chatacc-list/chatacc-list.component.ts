import { Component } from '@angular/core';
import { Employer } from '../../model/employer';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-chatacc-list',
  templateUrl: './chatacc-list.component.html',
  styleUrl: './chatacc-list.component.css'
})
export class ChataccListComponent {
  employers: Employer[] = [];
  check = sessionStorage.getItem('userId');
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role=sessionStorage.getItem('role');

  constructor(
    private employerService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.role === ('Admin');
    this.isInstructor =this.role === ('Instructor');
    this.isStudent = this.role === ('Student');
    this.getEmployers();

  }

  
  private getEmployers(): void {
    this.employerService.getEmployerList().subscribe({
      next: (data) => {
        this.employers = data;
      },
      error: (e) => console.error(e),
    });
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }
}
