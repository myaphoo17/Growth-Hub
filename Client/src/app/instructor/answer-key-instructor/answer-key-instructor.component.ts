import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionModel } from '../../models/instructor/question.model';
import { OptionModel } from '../../models/instructor/option.model';

@Component({
  selector: 'app-answer-key-instructor',
  templateUrl: './answer-key-instructor.component.html',
  styleUrls: ['./answer-key-instructor.component.css']
})
export class AnswerKeyInstructorComponent implements OnChanges {
  @Input() question: QuestionModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ points: number, updatedOptions: OptionModel[] }>();

  points: number = 0;
  selectedOptions: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question) {
      this.points = this.question.totalPoints || 0;
      this.selectedOptions = this.question.options.filter(option => option.isCorrect).map(option => option.id);
    }
  }

  toggleOption(optionId: number) {
    const index = this.selectedOptions.indexOf(optionId);
    if (index === -1) {
      this.selectedOptions.push(optionId);
    } else {
      this.selectedOptions.splice(index, 1);
    }
  }

  saveAnswerKey() {
    if (this.question) {
      const updatedOptions: OptionModel[] = this.question.options.map(option => ({
        ...option,
        isCorrect: this.selectedOptions.includes(option.id)
      }));
      this.save.emit({ points: this.points, updatedOptions });
    }
  }

  closeModal() {
    this.close.emit();
  }
}