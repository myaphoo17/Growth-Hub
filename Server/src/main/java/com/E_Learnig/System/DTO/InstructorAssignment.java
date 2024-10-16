package com.E_Learnig.System.DTO;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "instructorassi")
public class InstructorAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Nullable
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime dueDate;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private EmployeeDTO instructor;

    @OneToMany(mappedBy = "instructorAssignment" )
    @JsonIgnore
    private List<StudentAssignment> studentAssignments;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "course_id")
    private CourseDTO course;
}

