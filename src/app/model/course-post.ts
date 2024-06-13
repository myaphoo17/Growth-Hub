// src/app/models/course.model.ts

export interface Lecture {
  id: number;
  title: string;
  type: 'video' | 'text' | 'exam' | 'assignment';
  content: string;
}

export interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  sections: Section[];
}
