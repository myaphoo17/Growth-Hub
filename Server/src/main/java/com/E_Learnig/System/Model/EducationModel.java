package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.EmployeeDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class EducationModel {

    private long id;
    private String degree;
    private String institution;
    private String startDate;
    private String graduationDate;
    private EmployeeDTO employeeDTO;
}
