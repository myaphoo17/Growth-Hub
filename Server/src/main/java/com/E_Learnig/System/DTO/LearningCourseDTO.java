package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "enrolled_course")
public class LearningCourseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private EmployeeDTO employeeDTO;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference
    private CourseDTO courseDTOA;

    private LocalDate startDate;
    private LocalDate endDate;
    private boolean answerExam;

    @Column(name = "unenrolled", nullable = false)
    private Integer deleted = 0;;

    @Transient
    private Long enrollmentsCount;

    // Constructors, getters, setters
    public LearningCourseDTO() {}
    public LearningCourseDTO(CourseDTO courseDTOA, Long enrollmentsCount) {
        this.courseDTOA = courseDTOA;
        this.enrollmentsCount = enrollmentsCount;
    }

}
