package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExamAnswerCountModel {
    private Long courseId;
    private Long count;

    public ExamAnswerCountModel(Long courseId, Long count) {
        this.courseId = courseId;
        this.count = count;
    }
}