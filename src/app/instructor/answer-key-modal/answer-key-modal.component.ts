
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-answer-key-modal',
  templateUrl: './answer-key-modal.component.html',
  styleUrls: ['./answer-key-modal.component.css']
})
export class AnswerKeyModalComponent {
  @Input() question: any;
  @Output() save = new EventEmitter<any>();
  points: number = 1;
  selectedOptions: number[] = [];
  errorMessage: string = '';

  ngOnInit() {
    if (this.question) {
      this.points = this.question.points;
      this.selectedOptions = this.question.options
        .map((opt: any, index: number) => this.question.correctAnswer?.includes(index) ? index : null)
        .filter((index: null) => index !== null) as number[];
    }
  }

  toggleOption(index: number) {
    if (this.selectedOptions.includes(index)) {
      this.selectedOptions = this.selectedOptions.filter(opt => opt !== index);
    } else {
      this.selectedOptions.push(index);
    }
    // Clear error message when options are selected
    if (this.selectedOptions.length > 0) {
      this.errorMessage = '';
    }
  }

  saveAnswerKey() {
    if (this.selectedOptions.length === 0) {
      // Show error if no options selected
      this.errorMessage = 'Please Choose Correct Answer';
      return;
    }

    this.errorMessage = '';
    this.save.emit({ points: this.points, selectedOptions: this.selectedOptions });
  }

  closeModal() {
    this.save.emit(null);
  }
}
