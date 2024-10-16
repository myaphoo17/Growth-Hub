package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.UploadFilesDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
public class SectionModel {

    private long id;
    private String title;
    private List<UploadFilesDTO> uploadFileDTOS;
    private CourseDTO courseDTO;
}
