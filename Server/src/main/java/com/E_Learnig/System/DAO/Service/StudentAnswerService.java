package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.*;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.Model.StudentAnswerModel;
import com.E_Learnig.System.Model.StudentAnswerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StudentAnswerService {

    @Autowired
    private ExamRepository examRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private OptionRepository optionRepo;

    @Autowired
    private StudentAnswerRepository studentAnswerRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private ExamResultRepository examResultRepo;

    @Autowired
    private GradeRepository gradeRepo;

    public List<StudentAnswerResponse> saveStudentAnswers(long examId, String staffId, Long courseId, List<StudentAnswerModel> answers) {
        Set<String> uniqueAnswers = new HashSet<>();
        List<StudentAnswerResponse> responseList = new ArrayList<>();

        for (StudentAnswerModel answer : answers) {
            Long questionId = answer.getQuestionId(); // This is already Long
            for (Long optionId : answer.getOptionIds()) {
                String uniqueKey = examId + "_" + staffId + "_" + questionId + "_" + optionId;
                if (!uniqueAnswers.contains(uniqueKey)) {
                    uniqueAnswers.add(uniqueKey);

                    // Debugging logs
                    System.out.println("Processing answer for examId: " + examId + ", questionId: " + questionId + ", optionId: " + optionId);

                    try {
                        StudentAnswerDTO studentAnswerDTO = new StudentAnswerDTO();
                        studentAnswerDTO.setExam(examRepo.findById(examId)
                                .orElseThrow(() -> new RuntimeException("Exam not found")));
                        studentAnswerDTO.setQuestion(questionRepo.findById(questionId)
                                .orElseThrow(() -> new RuntimeException("Question not found")));
                        studentAnswerDTO.setOption(optionRepo.findById(optionId)
                                .orElseThrow(() -> new RuntimeException("Option not found")));
                        studentAnswerDTO.setStaffId(staffId);  // Set staffId as String
                        studentAnswerDTO.setCourse(courseRepo.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found")));
                        studentAnswerRepo.save(studentAnswerDTO);

                        boolean isCorrect = studentAnswerDTO.getOption().isCorrect();
                        responseList.add(new StudentAnswerResponse(questionId, optionId, isCorrect));
                    } catch (Exception e) {
                        // Log specific issues with individual answers
                        System.err.println("Error processing answer: " + e.getMessage());
                    }
                }
            }
        }
        return responseList;
    }


//    public Map<Long, Map<String, Object>> getExamResults(long examId, String staffId) {
//        List<StudentAnswerDTO> studentAnswers = studentAnswerRepo.findByExamIdAndStaffId(examId, staffId);
//        Map<Long, Map<String, Object>> results = new HashMap<>();
//
//        for (StudentAnswerDTO answer : studentAnswers) {
//            long questionId = answer.getQuestion().getId();
//            long optionId = answer.getOption().getId();
//            boolean isCorrect = answer.getOption().isCorrect();
//
//            results.putIfAbsent(questionId, new HashMap<>());
//            Map<String, Object> questionResults = results.get(questionId);
//
//            questionResults.putIfAbsent("isCorrect", true);
//            questionResults.putIfAbsent("selectedOptions", new ArrayList<Long>());
//            questionResults.putIfAbsent("correctOptions", new ArrayList<OptionDTO>());
//
//            if (!isCorrect) {
//                questionResults.put("isCorrect", false);
//            }
//
//            ((List<Long>) questionResults.get("selectedOptions")).add(optionId);
//
//            if (isCorrect) {
//                ((List<OptionDTO>) questionResults.get("correctOptions")).add(answer.getOption());
//            }
//        }
//
//        return results;
//    }


    public Map<Long, Map<String, Object>> getStudentAnswersByCourseAndStaff(long courseId, String staffId) {
        List<StudentAnswerDTO> studentAnswers = studentAnswerRepo.findByCourseIdAndStaffId(courseId, staffId);
        Map<Long, Map<String, Object>> results = new HashMap<>();

        for (StudentAnswerDTO answer : studentAnswers) {
            long questionId = answer.getQuestion().getId();
            long optionId = answer.getOption().getId();
            boolean isCorrect = answer.getOption().isCorrect();

            results.putIfAbsent(questionId, new HashMap<>());
            Map<String, Object> questionResults = results.get(questionId);

            questionResults.putIfAbsent("isCorrect", true);
            questionResults.putIfAbsent("selectedOptions", new ArrayList<Long>());
            questionResults.putIfAbsent("correctOptions", new ArrayList<OptionDTO>());

            if (!isCorrect) {
                questionResults.put("isCorrect", false);
            }

            ((List<Long>) questionResults.get("selectedOptions")).add(optionId);

            if (isCorrect) {
                ((List<OptionDTO>) questionResults.get("correctOptions")).add(answer.getOption());
            }
        }

        return results;
    }

    public boolean hasTakenExam(Long courseId, String staffId) {
        Optional<ExamDTO> examOpt = examRepo.findByCourseId(courseId);
        if (examOpt.isPresent()) {
            ExamDTO exam = examOpt.get();
            return studentAnswerRepo.existsByExamIdAndStaffId(exam.getId(), staffId);
        }
        return false;
    }

    public List<StudentAnswerDTO> getStudentAnswers(long examId, String staffId) {
        return studentAnswerRepo.findByExamIdAndStaffId(examId, staffId);
    }

//    public List<StudentAnswerDTO> getStudentAnswers(Long examId, String staffId) {
//        return studentAnswerRepo.findByExamIdAndStaffId(examId, staffId);
//    }

    public void saveExamResult(ExamResultDTO examResult) {
        examResultRepo.save(examResult);
    }

    public String evaluateStudentPerformance(int earnedPoints, Long courseId) {
        List<GradeDTO> grades = gradeRepo.findByCourseId(courseId);

        for (GradeDTO grade : grades) {
            if (earnedPoints >= grade.getMinPoints() && earnedPoints <= grade.getMaxPoints()) {
                return grade.getName(); // Return the grade name or code (A, B, C, etc.)
            }
        }
        return "Fail";
    }
}
