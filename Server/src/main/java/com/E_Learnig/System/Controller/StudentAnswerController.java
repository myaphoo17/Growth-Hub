
package com.E_Learnig.System.Controller;
import com.E_Learnig.System.DAO.Service.StudentAnswerService;
import com.E_Learnig.System.DTO.StudentAnswerDTO;
import com.E_Learnig.System.Model.StudentAnswerModel;
import com.E_Learnig.System.Model.StudentAnswerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/student_exam")
public class StudentAnswerController {

    @Autowired
    private StudentAnswerService studentAnswerService;

    @PostMapping("/{examId}/submit")
    public ResponseEntity<?> submitExamAnswers(@PathVariable long examId, @RequestBody Map<String, Object> payload) {
        String staffId = (String) payload.get("staffId");
        Long courseId = (payload.get("courseId") != null) ? ((Integer) payload.get("courseId")).longValue() : null;
        List<Map<String, Object>> answers = (List<Map<String, Object>>) payload.get("answers");

        try {
            List<StudentAnswerModel> studentAnswers = new ArrayList<>();
            for (Map<String, Object> answer : answers) {
                Long questionId = ((Integer) answer.get("questionId")).longValue();
                List<Long> optionIds = ((List<Integer>) answer.get("optionIds")).stream().map(Integer::longValue).collect(Collectors.toList());
                StudentAnswerModel model = new StudentAnswerModel();
                model.setQuestionId(questionId);
                model.setOptionIds(optionIds);
                model.setCourseId(courseId); // Set courseId
                studentAnswers.add(model);
            }
            List<StudentAnswerResponse> response = studentAnswerService.saveStudentAnswers(examId, staffId, courseId, studentAnswers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit exam answers");
        }
    }

    @GetMapping("/hasTakenExam/{courseId}/{staffId}")
    public ResponseEntity<Boolean> hasTakenExam(@PathVariable Long courseId, @PathVariable String staffId) {
        boolean hasTaken = studentAnswerService.hasTakenExam(courseId, staffId);
        return ResponseEntity.ok(hasTaken);
    }

    @GetMapping("/student-answers")
    public ResponseEntity<List<StudentAnswerDTO>> getStudentAnswers(@RequestParam Long examId, @RequestParam String staffId) {
        List<StudentAnswerDTO> answers = studentAnswerService.getStudentAnswers(examId, staffId);
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/student-answers/{courseId}/{staffId}")
    public Map<Long, Map<String, Object>> getStudentAnswersByCourseAndStaff(
            @PathVariable long courseId,
            @PathVariable String staffId) {
        return studentAnswerService.getStudentAnswersByCourseAndStaff(courseId, staffId);
    }


}






