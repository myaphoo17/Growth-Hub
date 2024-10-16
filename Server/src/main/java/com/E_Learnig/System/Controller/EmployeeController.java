package com.E_Learnig.System.Controller;


import com.E_Learnig.System.DAO.Repository.ExamRepository;
import com.E_Learnig.System.DAO.Service.EmployeeService;
import com.E_Learnig.System.DAO.Service.LearningCourseService;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.LearningCourseDTO;
import com.E_Learnig.System.Model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/admin")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private LearningCourseService learningCourseService;
    @Autowired
    private ExamRepository examRepository;


    @PostMapping("/employerupload")
    public ResponseEntity<?> uploadUsersData(@RequestParam("file") MultipartFile file) throws IOException {
        if (employeeService.isValidExcelFile(file)) {
            employeeService.uploadEmployerData(file);
            return ResponseEntity.ok(Map.of("Message", "Employee data uploaded and saved to database successfully"));
        } else {
            return ResponseEntity.badRequest().body("Invalid file format. Please upload an Excel file.");
        }
    }

    @GetMapping(value = "/employerlist", produces = "application/json")
    public List<EmployeeModel> getAdminAndInstructor(ModelMap model) {
        return employeeService.getInstructorEmployer();
    }
    @GetMapping(value = "/studentlist", produces = "application/json")
    public List<EmployeeModel> getStudent(ModelMap model) {
        return employeeService.getStudentEmployer();
    }

    @GetMapping("/profile/{staffId}")
    public ResponseEntity<EmployeeModel> getProfileById(@PathVariable String staffId) {
        EmployeeModel employeeModel = employeeService.getProfileByStaffId(staffId);
        if (employeeModel != null) {
            return ResponseEntity.ok(employeeModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateEmployer/{staffId}")
    public ResponseEntity<?> updateEmployer(@PathVariable String staffId, @RequestBody EmployeeModel newEmployeeModel) {
        int result = employeeService.updateEmployerRole(staffId, newEmployeeModel);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("Message", "Employer role updated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employer not found or status not provided");
        }
    }
    @PutMapping("/updateEmployerInformation/{sr}")
    public ResponseEntity<?> updateEmployerInformation(@PathVariable Number sr, @RequestBody EmployeeModel newEmployeeModel) {
        Long id=sr.longValue();
        int result = employeeService.updateEmployer(id, newEmployeeModel);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("Message", "Employer  updated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employer not found or status not provided");
        }
    }
    @PutMapping("/permission/{staffId}")
    public ResponseEntity<?> changePermissionEmployer(@PathVariable String staffId, @RequestBody EmployeeModel newEmployeeModel) {
        int result = employeeService.changePermissionEmployer(staffId, newEmployeeModel);
        if (result == 1) {
            return ResponseEntity.ok(Map.of("Message", "Employer permission changed successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employer not found or status not provided");
        }
    }
    @PutMapping("/courseApproved")
    public ResponseEntity<?> courseApprovedByAdmin( @RequestBody CourseApprovedModel approvedModel) {
        CourseDTO result = employeeService.courseApprovedByAdmin(approvedModel);
        if (result != null) {
            return ResponseEntity.ok(Map.of("Message", "Course Approved successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course Approved Failed !");
        }
    }
    @GetMapping("/getInstructorInfromation/{staffId}")
    public ResponseEntity<EmployeeModel> getInstructorInfromation(@PathVariable Number staffId) {
        long staffIdLong = staffId.longValue();
        EmployeeModel employeeModel = employeeService.getProfileBySr(staffIdLong);
        if (employeeModel != null) {
            return ResponseEntity.ok(employeeModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/monthly/{year}")
    public List<MonthlyCourseEnrollmentModel> getMonthlyEnrollments(@PathVariable int year) {
        return learningCourseService.getMonthlyEnrollments(year);
    }

    @GetMapping("/monthly-data/{year}")
    public ResponseEntity<List<MonthlyDataModel>> getMonthlyData(@PathVariable int year) {
        List<MonthlyDataModel> monthlyData = learningCourseService.getMonthlyData(year);
        if (monthlyData != null && !monthlyData.isEmpty()) {
            return ResponseEntity.ok(monthlyData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);  // Return an appropriate response
        }
    }

    @GetMapping("/monthly-data/{staffId}/{year}")
    public List<MonthlyDataModel> getMonthlyDataByStaffId(
            @PathVariable("staffId") Long staffId,
            @PathVariable("year") int year) {
        return learningCourseService.getMonthlyDataByStaffId(year, staffId);
    }

    @GetMapping("/stats/{year}")
    public ResponseEntity<Map<Integer, ExamStats>> getMonthlyExamStats(@PathVariable int year) {
        Map<Integer, ExamStats> stats = learningCourseService.getMonthlyExamStats(year);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/checkExamHasCourse/{courseId}")
    public boolean getCourseListById(@PathVariable String courseId) {
        try {
            long courseIdLong = Long.parseLong(courseId);
            return examRepository.existsByCourseId(courseIdLong);
        } catch (NumberFormatException e) {
            // Handle the case where the courseId is not a valid number
            return false;
        }
    }

    @GetMapping("/amountOfAccount")
    public ResponseEntity<EmployeeModel> getAmountOfAccount() {
        EmployeeModel employeeModel = employeeService.getDataAmount();
        if (employeeModel != null) {
            return ResponseEntity.ok(employeeModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/staff/{staffId}")
    public List<CourseDTO> getCoursesByStaffId(@PathVariable String staffId) {
        return learningCourseService.getCoursesByStaffId(staffId);
    }

    @GetMapping("/course/{courseId}/year/{year}")
    public ResponseEntity<Long> getEnrollmentsByCourseId(
            @PathVariable Long courseId,
            @PathVariable int year) {
        Long enrollmentCount = learningCourseService.getEnrollmentsByCourseId(courseId, year);
        return ResponseEntity.ok(enrollmentCount);
    }
    @GetMapping("enrollments-byCourse/{staffId}/{year}")
    public ResponseEntity<List<CourseEnrollmentCountModel>> getCoursesWithEnrollmentsByStaffId(
            @PathVariable String staffId, @PathVariable int year) {
        List<CourseEnrollmentCountModel> coursesWithEnrollments = learningCourseService.getCoursesWithEnrollmentsByStaffId(staffId, year);
        return ResponseEntity.ok(coursesWithEnrollments);
    }

    @GetMapping("/enrollments-byAllCourse/{year}")
    public ResponseEntity<List<CourseEnrollmentCountModel>> getAllCoursesWithEnrollments(
            @PathVariable("year") int year) {
        List<CourseEnrollmentCountModel> result = learningCourseService.getAllCoursesWithEnrollmentsByYear(year);
        return ResponseEntity.ok(result);
    }


}

