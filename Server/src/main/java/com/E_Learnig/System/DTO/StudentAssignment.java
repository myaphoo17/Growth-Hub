package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "studentassi")
public class StudentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileType;

    @Nullable
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime submittedDate;

    @ManyToOne
    @JoinColumn(name = "student_id")

    private EmployeeDTO student;

    @ManyToOne
    @JoinColumn(name = "assignment_id")

    private InstructorAssignment instructorAssignment;

}
