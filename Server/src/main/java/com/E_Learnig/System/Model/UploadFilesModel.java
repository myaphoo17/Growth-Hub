package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class UploadFilesModel {

    private long id;
    private String title;
    private String url;
    private Boolean completed;
}
