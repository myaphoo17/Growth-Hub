package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CertificateResultModel {

    private Long certificateId;
    private String staffId;
    private Long courseId;
    private String status;
    private String grade;
    private String staffName;
    private String courseName;
    private String image;

    public CertificateResultModel(Long certificateId, String staffName, String courseName, String grade, String image) {
        this.certificateId = certificateId;
        this.staffName = staffName;
        this.courseName = courseName;
        this.grade = grade;
        this.image = image;
    }

}
