package com.E_Learnig.System.Model;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
public class CourseApprovedModel {
    private String adminId;
    private String courseId;
    private LocalDateTime approvedDate;
}
