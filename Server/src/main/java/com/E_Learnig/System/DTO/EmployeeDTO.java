package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "employee")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EmployeeDTO {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long sr;
        private String division;
        private String staffId;
        private String name;
        private String doorLogNo;
        private String department;
        private boolean defaultPasswordChange;
        private String team;
        private String email;
        private String status;
        private String role;
        private String defaultPassword;
        private String profilePhotoUrl;
        @OneToMany(mappedBy = "employeeDTO")
        @JsonIgnore
        private List<EducationDTO> educationDTO;
        @OneToMany(mappedBy = "employeeDTO")
        @JsonIgnore
        private List<CourseDTO> courseDTOS;

}
