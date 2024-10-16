package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class SavedCourseDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "savedCourseDTO", cascade = CascadeType.ALL)
    private List<CourseDTO> courseDTOList;
}
