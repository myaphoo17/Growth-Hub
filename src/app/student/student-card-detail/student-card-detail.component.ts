import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/courses';
import { ActivatedRoute } from '@angular/router';
import * as Base64 from 'js-base64';


@Component({
  selector: 'app-student-card-detail',
  templateUrl: './student-card-detail.component.html',
  styleUrl: './student-card-detail.component.css'
})
export class StudentCardDetailComponent implements OnInit{

  course: Course = {} as Course;
  courseId: number = 0;
  query: string = '';

  showInstructorModal = false;
  showModulesModal = false;
  modules = [
    {
      title: 'Introduction to JavaScript',
      description: 'In this module, you are introduced to JavaScript...',
      details: 'Module 1 • 7 hours to complete',
      included: '19 videos, 22 readings, 8 quizzes, 1 discussion prompt'
    },
    {
      title: 'The Building Blocks of a Program',
      description: 'This module covers the basic building blocks...',
      details: 'Module 2 • 7 hours to complete',
      included: 'Module details'
    },
    {
      title: 'Programming Paradigms',
      description: 'Learn about different programming paradigms...',
      details: 'Module 3 • 17 hours to complete',
      included: 'Module details'
    },
    {
      title: 'Testing',
      description: 'This module covers various testing techniques...',
      details: 'Module 4 • 4 hours to complete',
      included: 'Module details'
    },
    {
      title: 'End-of-Course Graded Assessment',
      description: 'Complete the final assessment to evaluate your knowledge...',
      details: 'Module 5 • 4 hours to complete',
      included: 'Module details'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('courseId');
      const decodedId = encodedId ? Base64.decode(encodedId) : '';
      this.courseId = +decodedId;
      this.getCourseDetails();
    });
  }

  getCourseDetails(): void {
    this.coursesService.getCourseById(this.courseId).subscribe(
        (courseData) => {
            console.log('Course data received:', courseData);
            this.course = courseData;
        },
        (error) => {
            console.error('Error fetching course details', error);
        }
    );
}

  toggleInstructorModal() {
    this.showInstructorModal = !this.showInstructorModal;
  }

  toggleModulesModal() {
    this.showModulesModal = !this.showModulesModal;
  }
}

