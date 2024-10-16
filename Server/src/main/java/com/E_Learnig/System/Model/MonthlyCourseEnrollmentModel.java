package com.E_Learnig.System.Model;

import lombok.Data;

@Data
public class MonthlyCourseEnrollmentModel {
    private int month;
    private long courseId;
    private String courseName;
    private long studentCount;

    public MonthlyCourseEnrollmentModel(int month, long courseId, String courseName, long studentCount) {
        this.month = month;
        this.courseId = courseId;
        this.courseName = courseName;
        this.studentCount = studentCount;
    }
}
