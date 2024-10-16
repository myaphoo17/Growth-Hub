package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.ExamRepository;
import com.E_Learnig.System.DAO.Repository.ExamResultRepository;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.Model.ExamAnswerCountModel;
import com.E_Learnig.System.Model.ExamResultModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamResultService {

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public ExamResultDTO saveExamResult(ExamResultModel examResultModel) {
        ExamResultDTO examResult = new ExamResultDTO();
        examResult.setStaffId(examResultModel.getStaffId());
        examResult.setCourseId(examResultModel.getCourseId());
        examResult.setExamId(examResultModel.getExamId());
        examResult.setEarnedPoints(examResultModel.getEarnedPoints());
        examResult.setStatus(examResultModel.getStatus());
        examResult.setGrade(examResultModel.getGrade());

        return examResultRepository.save(examResult);
    }
    public List<ExamResultModel> getAllPassedExamResultsWithStaffName() {
        return examResultRepository.findAllPassedExamResultsWithStaffName();
    }

    public List<CourseDTO> getCourseNames() {
        return examResultRepository.findCourseNames();
    }

    public List<ExamResultDTO> findByStatus(String status) {
        return examResultRepository.findByStatus(status);
    }

    public ExamResultDTO findByStaffIdAndCourseIdAndStatus(String staffId, Long courseId, String status) {
        return examResultRepository.findByStaffIdAndCourseIdAndStatus(staffId, courseId, status);
    }
    //    public List<ExamResultDTO> getExamResultsByCourseId(Long courseId) {
//        return examResultRepository.findByCourseId(courseId);
//    }
//
    public List<String> getStaffIdsByCourseIdAndStatus(Long courseId, String status) {
        return examResultRepository.findStaffIdsByCourseIdAndStatus(courseId, status);
    }
    public ExamAnswerCountModel countUsersByStaffIdAndCourseId(String staffId, Long courseId, String status) {
        return examResultRepository.countUsersByStaffIdAndCourseId(staffId, courseId, status);
    }
    public Map<String, Object> getExamResultsWithDetails(List<String> staffIds, Long courseId) {
        // Fetch exam results based on staffIds, courseId, and status
        List<ExamResultDTO> results = examResultRepository.findByStaffIdInAndCourseId(staffIds, courseId);

        // Fetch course details
        Optional<CourseDTO> courseOptional = courseRepository.findById(courseId);
        String courseName = courseOptional.map(CourseDTO::getTitle).orElse("Unknown Course");

        // Fetch employee details
        List<EmployeeDTO> employees = employeeRepository.findByStaffIdIn(staffIds);
        Map<String, String> staffNameMap = employees.stream()
                .collect(Collectors.toMap(EmployeeDTO::getStaffId, EmployeeDTO::getName));

        // Return the results as a map
        return Map.of(
                "results", results,
                "courseName", courseName,
                "staffNames", staffNameMap
        );
    }
    public List<ExamResultDTO> getCoursesByEmployeeIdAndStatus(String staffId, String status) {
        return examResultRepository.findByStaffIdAndStatus(staffId, status);
    }
}
