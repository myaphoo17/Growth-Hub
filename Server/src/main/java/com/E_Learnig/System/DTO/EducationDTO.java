package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter

@Table(name = "education")
public class EducationDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String degree;
    private String institution;
    private String startDate;
    private String graduationDate;
    @ManyToOne
    @JoinColumn(name = "employee_id") // Use @JoinColumn to specify the foreign key column
    private EmployeeDTO employeeDTO;

}
