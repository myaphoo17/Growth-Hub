package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "student_answers")
public class StudentAnswerDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private ExamDTO exam;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionDTO question;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private OptionDTO option;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseDTO course;

    @Column(name = "staff_id", nullable = false, length = 15)  // Ensure sufficient length
    private String staffId;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
