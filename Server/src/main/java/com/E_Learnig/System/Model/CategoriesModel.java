package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.CourseDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CategoriesModel {

    private long id;
    private String name;
    private List<CourseDTO> courseDTO;
}
