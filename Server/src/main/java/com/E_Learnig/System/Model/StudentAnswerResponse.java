package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StudentAnswerResponse {
    private long questionId;
    private long optionId;
    private boolean isCorrect;
    private int correctOptionId;

    public StudentAnswerResponse(long questionId, long optionId, boolean isCorrect) {
        this.questionId = questionId;
        this.optionId = optionId;
        this.isCorrect = isCorrect;
        this.correctOptionId = correctOptionId;
    }
}
