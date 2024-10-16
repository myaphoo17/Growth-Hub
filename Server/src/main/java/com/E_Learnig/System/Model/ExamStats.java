package com.E_Learnig.System.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class ExamStats {
    private int totalExams;
    private int passedExams;
    private int failedExams;

    public ExamStats(int totalExams, int passedExams, int failedExams) {
        this.totalExams = totalExams;
        this.passedExams = passedExams;
        this.failedExams = failedExams;
    }

    // Getters and setters
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
}

