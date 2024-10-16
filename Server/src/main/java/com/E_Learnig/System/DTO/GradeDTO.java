// GradeDTO.java
package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "grade")
public class GradeDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int minPoints;

    @Column(nullable = false)
    private int maxPoints;

    @Column(nullable = true)
    private int totalPoints;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseDTO course;

//    @OneToOne(mappedBy = "grade")
//    private StudentAnswerDTO studentAnswer;
}