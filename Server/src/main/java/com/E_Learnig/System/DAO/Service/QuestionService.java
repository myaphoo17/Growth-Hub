package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.QuestionRepository;
import com.E_Learnig.System.DTO.OptionDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import com.E_Learnig.System.Model.QuestionModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    QuestionRepository questionRepo;

    public long addQuestion(QuestionModel questionModel) {
        QuestionDTO questionDTO = modelMapper.map(questionModel, QuestionDTO.class);

        // Set createdDate and updatedDate
        questionDTO.setCreatedDate(LocalDateTime.now());
        questionDTO.setUpdatedDate(LocalDateTime.now());

        // Ensure options are correctly linked to the question and calculate totalPoints
        List<OptionDTO> options = questionDTO.getOptions();
        int totalPoints = 0;
        if (options != null) {
            for (OptionDTO option : options) {
                option.setQuestion(questionDTO);
                if (option.getIsCorrect()) {
                    totalPoints += option.getPoints();
                }
            }
        }
        questionDTO.setTotalPoints(totalPoints); // Set the totalPoints for the question

        questionRepo.save(questionDTO);
        return 1;
    }

    // Get all exams
    public List<QuestionModel> getAllQuestions() {
        List<QuestionDTO> questionDTOS = questionRepo.findAll();
        return questionDTOS.stream()
                .map(questionDTO -> modelMapper.map(questionDTO, QuestionModel.class))
                .collect(Collectors.toList());
    }

}



