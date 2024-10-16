package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.*;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.OptionDTO;
import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import com.E_Learnig.System.Exception.ResourceNotFoundException;
import com.E_Learnig.System.Model.ExamModel;
import com.E_Learnig.System.Model.OptionModel;
import com.E_Learnig.System.Model.QuestionModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ExamService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ExamRepository examRepo;

    @Autowired
    QuestionRepository questionRepo;

    @Autowired
    OptionRepository optionRepo;

    @Autowired
    private StudentAnswerRepository studentAnswerRepo;

    @Autowired
    CourseRepository courseRepo; // Add CourseRepository

    @Transactional
    public int addExam(Long courseId, ExamModel examModel) {
        try {
            CourseDTO course = courseRepo.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            ExamDTO examDTO = new ExamDTO();
            examDTO.setTitle(examModel.getTitle());
            examDTO.setDescription(examModel.getDescription());
            examDTO.setCourse(course);

            examRepo.save(examDTO);

            for (QuestionDTO questionDTO : examModel.getQuestions()) {
                questionDTO.setExam(examDTO);
                questionRepo.save(questionDTO);

                for (OptionDTO optionDTO : questionDTO.getOptions()) {
                    optionDTO.setQuestion(questionDTO);
                    optionRepo.save(optionDTO);
                }
            }

            return 1; // success
        } catch (RuntimeException e) {
            // Handle specific runtime exceptions
            throw new RuntimeException("Error while adding exam: " + e.getMessage());
        }
    }

    public Optional<ExamDTO> findExamByCourseId(Long courseId) {
        return examRepo.findByCourseId(courseId);
    }

    public ExamModel getExamDetailsByCourseId(Long courseId) {
        ExamDTO exam = examRepo.findByCourseId(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        ExamModel examModel = new ExamModel(exam);
        examModel.setTitle(exam.getTitle());
        examModel.setDescription(exam.getDescription());
        examModel.setCourseId(exam.getCourse().getId());
        examModel.setId(exam.getId()); // Ensure exam ID is set

        List<QuestionDTO> questionDTOs = questionRepo.findByExamId(exam.getId());
        List<QuestionModel> questionModels = new ArrayList<>();

        for (QuestionDTO questionDTO : questionDTOs) {
            QuestionModel questionModel = new QuestionModel();
            questionModel.setTitle(questionDTO.getTitle());

            List<OptionDTO> optionDTOs = optionRepo.findByQuestionId(questionDTO.getId());
            List<OptionModel> optionModels = new ArrayList<>();

            for (OptionDTO optionDTO : optionDTOs) {
                OptionModel optionModel = new OptionModel();
                optionModel.setMultiple(optionDTO.getMultiple());
                optionModel.setIsCorrect(optionDTO.getIsCorrect());
                optionModel.setPoints(optionDTO.getPoints());

                optionModels.add(optionModel);
            }

            questionModel.setOption(optionModels);
            questionModels.add(questionModel);
        }

        examModel.setQuestions(questionDTOs);

        return examModel;
    }
//
//    @Transactional
//    public ExamModel updateExam(long courseId, ExamDTO examDTO) {
//        ExamDTO existingExam = examRepo.findByCourseId(courseId)
//                .orElseThrow(() -> new ResourceNotFoundException("Exam not found for courseId: " + courseId));
//
//        // Update exam title and description
//        existingExam.setTitle(examDTO.getTitle());
//        existingExam.setDescription(examDTO.getDescription());
//
//        // Process each question in the exam DTO
//        Iterator<QuestionDTO> iterator = existingExam.getQuestions().iterator();
//        while (iterator.hasNext()) {
//            QuestionDTO existingQuestion = iterator.next();
//            boolean found = false;
//
//            for (QuestionDTO questionDTO : examDTO.getQuestions()) {
//                if (existingQuestion.getId() == questionDTO.getId()) {
//                    // Update question title and total points
//                    existingQuestion.setTitle(questionDTO.getTitle());
//                    existingQuestion.setTotalPoints(questionDTO.getTotalPoints());
//                    existingQuestion.setExam(existingExam);
//
//                    // Process each option in the question DTO
//                    List<OptionDTO> existingOptions = existingQuestion.getOptions();
//                    List<OptionDTO> updatedOptions = questionDTO.getOptions();
//
//                    // Remove options that are no longer present in updatedOptions
//                    List<OptionDTO> optionsToRemove = new ArrayList<>();
//                    for (OptionDTO existingOption : existingOptions) {
//                        boolean optionFound = false;
//                        for (OptionDTO updatedOption : updatedOptions) {
//                            if (existingOption.getId() == updatedOption.getId()) {
//                                // Update existing option properties
//                                existingOption.setMultiple(updatedOption.getMultiple());
//                                existingOption.setIsCorrect(updatedOption.getIsCorrect());
//                                existingOption.setPoints(updatedOption.getPoints());
//                                optionFound = true;
//                                break;
//                            }
//                        }
//                        if (!optionFound) {
//                            optionsToRemove.add(existingOption);
//                        }
//                    }
//
//                    // Delete options that are no longer present in updatedOptions
//                    for (OptionDTO optionToRemove : optionsToRemove) {
//                        existingOptions.remove(optionToRemove);
//                        optionRepo.deleteById(optionToRemove.getId());
//                    }
//
//                    // Add new options if any
//                    for (OptionDTO updatedOption : updatedOptions) {
//                        boolean optionExists = existingOptions.stream()
//                                .anyMatch(opt -> opt.getId() == updatedOption.getId());
//
//                        if (!optionExists) {
//                            OptionDTO newOption = new OptionDTO();
//                            newOption.setMultiple(updatedOption.getMultiple());
//                            newOption.setIsCorrect(updatedOption.getIsCorrect());
//                            newOption.setPoints(updatedOption.getPoints());
//                            newOption.setQuestion(existingQuestion);
//                            existingOptions.add(newOption);
//                        }
//                    }
//
//                    found = true;
//                    break;
//                }
//            }
//
//            // If the question is not found in the updated list, delete it
//            if (!found) {
//                iterator.remove(); // Remove question from exam
//                questionRepo.deleteById(existingQuestion.getId()); // Delete question and its options
//            }
//        }
//
//        // Add new questions if any
//        for (QuestionDTO questionDTO : examDTO.getQuestions()) {
//            boolean questionExists = existingExam.getQuestions().stream()
//                    .anyMatch(q -> q.getId() == questionDTO.getId());
//
//            if (!questionExists) {
//                QuestionDTO newQuestion = new QuestionDTO();
//                newQuestion.setTitle(questionDTO.getTitle());
//                newQuestion.setTotalPoints(questionDTO.getTotalPoints());
//                newQuestion.setExam(existingExam);
//
//                // Process options for new question
//                List<OptionDTO> newOptions = new ArrayList<>();
//                for (OptionDTO optionDTO : questionDTO.getOptions()) {
//                    OptionDTO newOption = new OptionDTO();
//                    newOption.setMultiple(optionDTO.getMultiple());
//                    newOption.setIsCorrect(optionDTO.getIsCorrect());
//                    newOption.setPoints(optionDTO.getPoints());
//                    newOption.setQuestion(newQuestion);
//                    newOptions.add(newOption);
//                }
//                newQuestion.setOptions(newOptions);
//
//                existingExam.getQuestions().add(newQuestion);
//            }
//        }
//
//        // Save the updated exam
//        examRepo.save(existingExam);
//
//        return new ExamModel(existingExam);
//    }

    @Transactional
    public ExamModel updateExam(long courseId, ExamDTO examDTO) {
        ExamDTO existingExam = examRepo.findByCourseId(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found for courseId: " + courseId));

        // Update exam title and description
        existingExam.setTitle(examDTO.getTitle());
        existingExam.setDescription(examDTO.getDescription());

        // Process each question in the exam DTO
        Iterator<QuestionDTO> iterator = existingExam.getQuestions().iterator();
        while (iterator.hasNext()) {
            QuestionDTO existingQuestion = iterator.next();
            boolean found = false;

            for (QuestionDTO questionDTO : examDTO.getQuestions()) {
                if (existingQuestion.getId() == questionDTO.getId()) {
                    // Update question title and total points
                    existingQuestion.setTitle(questionDTO.getTitle());
                    existingQuestion.setTotalPoints(questionDTO.getTotalPoints());
                    existingQuestion.setExam(existingExam);

                    // Process each option in the question DTO
                    List<OptionDTO> existingOptions = existingQuestion.getOptions();
                    List<OptionDTO> updatedOptions = questionDTO.getOptions();

                    // Remove options that are no longer present in updatedOptions
                    List<OptionDTO> optionsToRemove = new ArrayList<>();
                    for (OptionDTO existingOption : existingOptions) {
                        boolean optionFound = false;
                        for (OptionDTO updatedOption : updatedOptions) {
                            if (existingOption.getId() == updatedOption.getId()) {
                                // Update existing option properties
                                existingOption.setMultiple(updatedOption.getMultiple());
                                existingOption.setIsCorrect(updatedOption.getIsCorrect());
                                existingOption.setPoints(updatedOption.getPoints());
                                optionFound = true;
                                break;
                            }
                        }
                        if (!optionFound) {
                            optionsToRemove.add(existingOption);
                        }
                    }

                    // Delete options that are no longer present in updatedOptions
                    for (OptionDTO optionToRemove : optionsToRemove) {
                        existingOptions.remove(optionToRemove);
                        // Update student answers to remove references before deleting option
                        studentAnswerRepo.deleteByOptionId(optionToRemove.getId());
                        optionRepo.deleteById(optionToRemove.getId());
                    }

                    // Add new options if any
                    for (OptionDTO updatedOption : updatedOptions) {
                        boolean optionExists = existingOptions.stream()
                                .anyMatch(opt -> opt.getId() == updatedOption.getId());

                        if (!optionExists) {
                            OptionDTO newOption = new OptionDTO();
                            newOption.setMultiple(updatedOption.getMultiple());
                            newOption.setIsCorrect(updatedOption.getIsCorrect());
                            newOption.setPoints(updatedOption.getPoints());
                            newOption.setQuestion(existingQuestion);
                            existingOptions.add(newOption);
                        }
                    }

                    found = true;
                    break;
                }
            }

            // If the question is not found in the updated list, delete it
            if (!found) {
                iterator.remove(); // Remove question from exam
                questionRepo.deleteById(existingQuestion.getId()); // Delete question and its options
            }
        }

        // Add new questions if any
        for (QuestionDTO questionDTO : examDTO.getQuestions()) {
            boolean questionExists = existingExam.getQuestions().stream()
                    .anyMatch(q -> q.getId() == questionDTO.getId());

            if (!questionExists) {
                QuestionDTO newQuestion = new QuestionDTO();
                newQuestion.setTitle(questionDTO.getTitle());
                newQuestion.setTotalPoints(questionDTO.getTotalPoints());
                newQuestion.setExam(existingExam);

                // Process options for new question
                List<OptionDTO> newOptions = new ArrayList<>();
                for (OptionDTO optionDTO : questionDTO.getOptions()) {
                    OptionDTO newOption = new OptionDTO();
                    newOption.setMultiple(optionDTO.getMultiple());
                    newOption.setIsCorrect(optionDTO.getIsCorrect());
                    newOption.setPoints(optionDTO.getPoints());
                    newOption.setQuestion(newQuestion);
                    newOptions.add(newOption);
                }
                newQuestion.setOptions(newOptions);

                existingExam.getQuestions().add(newQuestion);
            }
        }

        // Save the updated exam
        examRepo.save(existingExam);

        return new ExamModel(existingExam);
    }

    public Optional<ExamDTO> findById(long id) {
        return examRepo.findById(id).map(examDTO -> {
            examDTO.getQuestions().forEach(question -> {
                int totalPoints = question.getOptions().stream().mapToInt(OptionDTO::getPoints).sum();
                question.setTotalPoints(totalPoints);
            });
            return examDTO;
        });
    }

    // Get all exams
    public List<ExamModel> getAllExams() {
        List<ExamDTO> examDTOs = examRepo.findAll();
        return examDTOs.stream()
                .map(examDTO -> modelMapper.map(examDTO, ExamModel.class))
                .collect(Collectors.toList());
    }


}

