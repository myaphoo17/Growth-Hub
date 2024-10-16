package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class EditVideoFileModel {
    private String courseId;
    private String id;
    private String url;
    private String title;
    private MultipartFile file;
}
