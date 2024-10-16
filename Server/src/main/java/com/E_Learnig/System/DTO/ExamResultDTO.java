// ExamResultDTO.java
package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "exam_results")
public class ExamResultDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String staffId;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private Long examId;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private Double earnedPoints;

}
