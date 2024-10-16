package com.E_Learnig.System.Model;

import java.util.List;

public class MonthlyDataModel {
    private int month;
    private long studentEnrollments;
    private int coursesCreated;
    private List<String> courseNames;
    private int totalExams;       // New field
    private int passedExams;      // New field
    private int failedExams;      // New field

    // Constructor including new fields
    public MonthlyDataModel(int month, long studentEnrollments, int coursesCreated, List<String> courseNames,
                            int totalExams, int passedExams, int failedExams) {
        this.month = month;
        this.studentEnrollments = studentEnrollments;
        this.coursesCreated = coursesCreated;
        this.courseNames = courseNames;
        this.totalExams = totalExams;
        this.passedExams = passedExams;
        this.failedExams = failedExams;
    }

    // Getters and setters
    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public long getStudentEnrollments() {
        return studentEnrollments;
    }

    public void setStudentEnrollments(long studentEnrollments) {
        this.studentEnrollments = studentEnrollments;
    }

    public int getCoursesCreated() {
        return coursesCreated;
    }

    public void setCoursesCreated(int coursesCreated) {
        this.coursesCreated = coursesCreated;
    }

    public List<String> getCourseNames() {
        return courseNames;
    }

    public void setCourseNames(List<String> courseNames) {
        this.courseNames = courseNames;
    }

    public int getTotalExams() {
        return totalExams;
    }

    public void setTotalExams(int totalExams) {
        this.totalExams = totalExams;
    }

    public int getPassedExams() {
        return passedExams;
    }

    public void setPassedExams(int passedExams) {
        this.passedExams = passedExams;
    }

    public int getFailedExams() {
        return failedExams;
    }

    public void setFailedExams(int failedExams) {
        this.failedExams = failedExams;
    }

    // Add any other necessary methods
}
