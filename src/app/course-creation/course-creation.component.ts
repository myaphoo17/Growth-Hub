import { Component } from '@angular/core';

interface Lecture {
  id: number;
  type: string;
  title: string;
  content: string;
}

interface Section {
  id: number;
  title: string;
  lectures: Lecture[];
}

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.css']
})
export class CourseCreationComponent {
  currentView: string = 'structure';
  course: { title: string; description: string; sections: Section[] } = {
    title: '',
    description: '',
    sections: [
      { id: 1, title: 'Section 1', lectures: [] }
    ]
  };
  learningObjectives: { text: string }[] = [
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' }
  ];
  requirements: { text: string }[] = [
    { text: '' }
  ];

  // Method to handle file input changes
  onFileChange(event: Event, lectureId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const lecture = this.findLectureById(lectureId);
        if (lecture) {
          lecture.content = base64;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  findLectureById(lectureId: number): Lecture | null {
    for (const section of this.course.sections) {
      const lecture = section.lectures.find(lec => lec.id === lectureId);
      if (lecture) {
        return lecture;
      }
    }
    return null;
  }

  toggleView(view: string) {
    this.currentView = view;
  }

  saveCourse() {
    // Logic to save the course
    console.log('Course saved', this.course);
  }

  submitIntendedStructure() {
    // Logic to submit the intended structure
    console.log('Intended structure submitted', {
      learningObjectives: this.learningObjectives,
      requirements: this.requirements
    });
  }

  addSection() {
    this.course.sections.push({ id: Date.now(), title: '', lectures: [] });
  }

  addLecture(sectionId: number, type: string) {
    const section = this.course.sections.find(s => s.id === sectionId);
    if (section) {
      section.lectures.push({ id: Date.now(), type, title: '', content: '' });
    }
  }

  addLearningObjective() {
    this.learningObjectives.push({ text: '' });
  }

  removeLearningObjective(index: number) {
    this.learningObjectives.splice(index, 1);
  }

  addRequirement() {
    this.requirements.push({ text: '' });
  }

  removeRequirement(index: number) {
    this.requirements.splice(index, 1);
  }

  editRequirement(index: number) {
    // Logic to edit the requirement
    const newRequirement = prompt('Edit Requirement:', this.requirements[index].text);
    if (newRequirement !== null) {
      this.requirements[index].text = newRequirement;
    }
  }
}
