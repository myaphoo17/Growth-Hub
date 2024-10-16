package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.ExamDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CourseModel {
    private long id;
    private String title;
    private String date;
    private boolean isDelete;
    private boolean isApproved;
    private String description;
    private String duration;
    private CategoriesDTO categoriesDTO;
    private List<UploadFilesModel> uploadFiles;
    private EmployeeDTO employeeDTO;
    private boolean hasExam;
}
