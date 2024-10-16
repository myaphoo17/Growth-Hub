package com.E_Learnig.System.Model;


import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ExamModel {

    private long id;
    private String title;
    private String description;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<QuestionDTO> questions;
    private Long courseId; // Change this field to Long
    private int totalPoints;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

//    public ExamModel(ExamDTO exam){
//
//    }

    public ExamModel(ExamDTO exam) {
        this.id = exam.getId();
        this.title = exam.getTitle();
        this.description = exam.getDescription();
        this.createdDate = exam.getCreatedDate();
        this.updatedDate = exam.getUpdatedDate();
        this.courseId = exam.getCourse().getId();
        this.totalPoints = exam.getQuestions().stream().mapToInt(QuestionDTO::getTotalPoints).sum();
        this.questions = exam.getQuestions().stream().map(QuestionDTO::new).collect(Collectors.toList());
    }

    public ExamModel(){

    }
}
