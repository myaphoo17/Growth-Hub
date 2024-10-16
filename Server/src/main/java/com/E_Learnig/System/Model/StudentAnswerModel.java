package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StudentAnswerModel {
    private long questionId;
    private List<Long> optionIds;
    private long courseId;
    private String staffId;

}