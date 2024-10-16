package com.E_Learnig.System.Model;


import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.OptionDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionModel {

    private long id;
    private ExamDTO exam;
    private String title;
    private int totalPoints;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<OptionModel> option;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public ExamDTO getExam() {
        return exam;
    }

    public void setExam(ExamDTO exam) {
        this.exam = exam;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public List<OptionModel> getOption() {
        return option;
    }

    public void setOption(List<OptionModel> option) {
        this.option = option;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }
}
