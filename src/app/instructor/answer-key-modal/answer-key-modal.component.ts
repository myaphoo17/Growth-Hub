
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-answer-key-modal',
  templateUrl: './answer-key-modal.component.html',
  styleUrls: ['./answer-key-modal.component.css']
})
export class AnswerKeyModalComponent {
  @Input() question: any;
  @Output() save = new EventEmitter<any>();
  points: number = 0;
  selectedOption: number | null = null;

  ngOnInit() {
    if (this.question) {
      this.points = this.question.points;
      this.selectedOption = this.question.correctAnswer;
    }
  }

  saveAnswerKey() {
    this.save.emit({ points: this.points, selectedOption: this.selectedOption });
  }

  closeModal() {
    this.save.emit(null);
  }
}
