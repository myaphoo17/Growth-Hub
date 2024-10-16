package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "question")
public class QuestionDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonBackReference
    private ExamDTO exam;

    @Lob
    @Column(nullable = false)
    private String title;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OptionDTO> options;

//    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
//    private List<StudentAnswerDTO> student;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "total_points", nullable = false)
    private int totalPoints; // Add this field

    public QuestionDTO(QuestionDTO questionDTO) {
    }

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    // No-argument constructor
    public QuestionDTO() {}
}
