package com.E_Learnig.System.Model;

public class MonthlyCourseAttendanceModel {
    private int month;
    private long courseId;
    private long attendanceCount;

    public MonthlyCourseAttendanceModel() {
        // Default constructor
    }

    public MonthlyCourseAttendanceModel(int month, long courseId, long attendanceCount) {
        this.month = month;
        this.courseId = courseId;
        this.attendanceCount = attendanceCount;
    }

    // Getters and setters

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public long getCourseId() {
        return courseId;
    }

    public void setCourseId(long courseId) {
        this.courseId = courseId;
    }

    public long getAttendanceCount() {
        return attendanceCount;
    }

    public void setAttendanceCount(long attendanceCount) {
        this.attendanceCount = attendanceCount;
    }

    // toString method (optional, for debugging/logging)

    @Override
    public String toString() {
        return "MonthlyCourseAttendanceModel{" +
                "month=" + month +
                ", courseId=" + courseId +
                ", attendanceCount=" + attendanceCount +
                '}';
    }
}
