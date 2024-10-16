package com.E_Learnig.System.Model;

import java.time.LocalDate;

public class WeeklyEnrollmentModel {
    private LocalDate date;
    private String courseName;
    private Long studentCount;

    // Constructors, getters, and setters
    public WeeklyEnrollmentModel(LocalDate date, String courseName, Long studentCount) {
        this.date = date;
        this.courseName = courseName;
        this.studentCount = studentCount;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}
