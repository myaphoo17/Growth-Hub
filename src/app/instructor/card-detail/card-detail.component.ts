import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}
  toggleInstructorModal() {
    this.showInstructorModal = !this.showInstructorModal;
  }

  toggleModulesModal() {
    this.showModulesModal = !this.showModulesModal;
  }
}
