package com.E_Learnig.System.Model;


import com.E_Learnig.System.DTO.QuestionDTO;
import lombok.Data;

@Data
public class OptionModel {

    private long id;
    private QuestionDTO question;
    private String multiple;
    private Boolean isCorrect;
    private int points;

}
