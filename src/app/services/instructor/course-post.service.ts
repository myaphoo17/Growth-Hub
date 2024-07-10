// src/app/services/course.service.ts

import { Injectable } from '@angular/core';
import { Course } from '../../models/instructor/course-post';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
    {
      id: 1,
      title: 'Angular Basics',
      description: 'Learn the basics of Angular framework.',
      sections: [
        {
          id: 1,
          title: 'Introduction',
          lectures: [
            {
              id: 1,
              title: 'What is Angular?',
              type: 'video',
              content: 'path/to/video1.mp4'
            },
            {
              id: 2,
              title: 'Getting Started',
              type: 'text',
              content: 'Angular is a platform for building mobile and desktop web applications...'
            }
          ]
        }
      ]
    }
  ];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourse(id: number): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  updateCourse(course: Course): void {
    const index = this.courses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      this.courses[index] = course;
    }
  }

  deleteCourse(id: number): void {
    this.courses = this.courses.filter(course => course.id !== id);
  }
}
