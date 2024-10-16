package com.E_Learnig.System.Controller;


import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.LearningCourseRepository;
import com.E_Learnig.System.DAO.Service.ExamResultService;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.DTO.LearningCourseDTO;
import com.E_Learnig.System.Model.ExamResultModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exam-results")
public class ExamResultController {

    @Autowired
    private ExamResultService examResultService;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private LearningCourseRepository learningCourseRepository;

    @PostMapping("/save")
    public ResponseEntity<ExamResultDTO> saveExamResult(@RequestBody ExamResultModel examResultModel) {
        ExamResultDTO examResult = examResultService.saveExamResult(examResultModel);
        if (examResultModel.getStatus().equals("Pass")) {
            EmployeeDTO employee = employeeRepository.findByStaffId(examResultModel.getStaffId());
            LearningCourseDTO existingDto = learningCourseRepository.findByEmployeeDTO_SrAndCourseDTOA_Id(employee.getSr(), examResultModel.getCourseId());

            if (existingDto != null) {
                existingDto.setAnswerExam(true);
                learningCourseRepository.save(existingDto);
            } else {
                // Handle case where existingDto is not found, if needed
            }
        }
        return ResponseEntity.ok(examResult);
    }
    @GetMapping
    public List<ExamResultDTO> getPassedExamResults() {
        return examResultService.findByStatus("Pass");
    }



    @GetMapping("/staffIdsByCourse")
    public List<String> getStaffIdsByCourseIdAndStatus(@RequestParam Long courseId, @RequestParam String status) {
        return examResultService.getStaffIdsByCourseIdAndStatus(courseId, status);
    }

    @GetMapping("/examResultsWithDetails")
    public ResponseEntity<Map<String, Object>> getExamResultsWithDetails(
            @RequestParam List<String> staffIds,
            @RequestParam Long courseId) {
        Map<String, Object> results = examResultService.getExamResultsWithDetails(staffIds, courseId);
        return ResponseEntity.ok(results);
    }

}
