package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExamResultModel {

    private String staffId;
    private String staffName;
    private Long courseId;
    private String CourseName;
    private Long examId;
    private Double earnedPoints;
    private String status;
    private String grade;

    public boolean isPassed() {
        return "PASSED".equalsIgnoreCase(status);
    }
}
