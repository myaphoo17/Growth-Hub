package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LearningCourseModel {
    private long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer deleted;


}
