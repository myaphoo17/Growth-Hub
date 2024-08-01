import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer-key-modal',
  templateUrl: './answer-key-modal.component.html',
  styleUrls: ['./answer-key-modal.component.css']
})
export class AnswerKeyModalComponent implements OnInit {
  @Input() question: any;
  @Output() save = new EventEmitter<any>();
  points: number = 1;
  selectedOptions: number[] = [];
  errorMessage: string = '';

  ngOnInit() {
    if (this.question) {
      this.points = this.question.points;
      // Ensure correctAnswer is not null or undefined
      this.selectedOptions = this.question.correctAnswer ? [...this.question.correctAnswer] : [];
    }
  }

  toggleOption(index: number) {
    if (this.selectedOptions.includes(index)) {
      this.selectedOptions = this.selectedOptions.filter(opt => opt !== index);
    } else {
      this.selectedOptions.push(index);
    }

    if (this.selectedOptions.length > 0) {
      this.errorMessage = '';
    }
  }

  saveAnswerKey() {
    if (this.selectedOptions.length === 0) {
      this.errorMessage = 'Please choose at least one correct answer.';
      return;
    }

    this.errorMessage = '';
    this.save.emit({ correctAnswer: this.selectedOptions, points: this.points });
  }

  closeModal() {
    this.save.emit(null);
  }
}
