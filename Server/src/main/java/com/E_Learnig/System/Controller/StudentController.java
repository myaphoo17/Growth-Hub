package com.E_Learnig.System.Controller;


import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.LearningCourseRepository;
import com.E_Learnig.System.DAO.Service.*;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.Model.CourseModel;
import com.E_Learnig.System.Model.EducationModel;
import com.E_Learnig.System.Model.EmployeeModel;
import com.E_Learnig.System.Model.ExamAnswerCountModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/student")
public class StudentController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EducationService educationService;

    @Autowired
    private StudentService studentService;



    @Autowired
    private ModelMapper mapper;

    @Autowired
    private LearningCourseService learningCourseService;

    @Autowired
    private ExamResultService examResultServiceService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LearningCourseRepository learningCourseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UploadFilesService uploadFilesService;

    @PutMapping("/{id}/complete")
    public ResponseEntity<UploadFilesDTO> markAsCompleted(@PathVariable Long id, @RequestParam boolean completed) {
        UploadFilesDTO updatedVideo = uploadFilesService.markAsCompleted(id, completed);
        return ResponseEntity.ok(updatedVideo);
    }
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<UploadFilesDTO>> getVideosByCourseId(@PathVariable Long courseId) {
        List<UploadFilesDTO> videos = uploadFilesService.getVideosByCourseId(courseId);
        return ResponseEntity.ok(videos);
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
    @PostMapping("/updateProfile")
    public ResponseEntity<?> updateProfilePhoto(@RequestParam("file") MultipartFile file, @RequestParam("staffId") String staffId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Unsupported file type");
        }

        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file);
            String profilePhotoUrl = (String)uploadResult.get("url");
            EmployeeModel existingEmployerModel = employeeService.getProfileByStaffId(staffId);
            if (existingEmployerModel == null) {
                return ResponseEntity.notFound().build();
            }

            // Convert EmployerModel to EmployerDTO
            EmployeeDTO existingEmployerDTO = mapper.map(existingEmployerModel, EmployeeDTO.class);
            existingEmployerDTO.setProfilePhotoUrl(profilePhotoUrl);

            EmployeeDTO updatedEmployerDTO = studentService.updateStudentProfile(staffId, existingEmployerDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());
            response.put("url", profilePhotoUrl);
            response.put("fileType", contentType);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/updateInformation/{staffId}")
    public ResponseEntity<EmployeeDTO> updateInformation(@PathVariable String staffId, @RequestBody EmployeeDTO newEmployeeDTO) {
        EmployeeDTO updatedInstructor = studentService.updateStudentProfile(staffId, newEmployeeDTO);
        return ResponseEntity.ok(updatedInstructor);
    }

    @PostMapping("/addEducation/{dbId}")
    public ResponseEntity<EducationDTO> addEducationToEmployer(@PathVariable String dbId, @RequestBody EducationDTO educationDTO) {
        Long id = convertToLong(dbId);
        EducationDTO addedEducation = studentService.addEducationToEmployer(id, educationDTO);
        return ResponseEntity.ok(addedEducation);
    }


    @GetMapping("/education/{id}")
    public ResponseEntity<EducationModel> getEducationById(@PathVariable String id) {
        Long idd = convertToLong(id);
        EducationModel education = educationService.getEducationsById(idd);
        if (education != null) {
            return ResponseEntity.ok(education);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/updateEducation/{id}")
    public ResponseEntity<EducationDTO> updateEducation(@PathVariable String id, @RequestBody EducationDTO newEducationDTO) {
        Long lid = convertToLong(id);
        EducationDTO updatedEducationDTO = educationService.updateEducation(lid, newEducationDTO);
        return ResponseEntity.ok(updatedEducationDTO);
    }


    @DeleteMapping("/deleteEducation/{educationId}")
    public ResponseEntity<?> deleteEducation(@PathVariable String educationId) {
        Long lid = convertToLong(educationId);
        boolean deleted = educationService.deleteEducation(lid);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/getEducations/{dbId}")
    public ResponseEntity<List<EducationDTO>> getEducationsByEmployer(@PathVariable String dbId) {
        Long id = convertToLong(dbId);
        List<EducationDTO> educationDTOS = studentService.getEducationsByEmployer(id);
        return ResponseEntity.ok(educationDTOS);
    }
    private Long convertToLong(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid employer ID: " + id, e);
        }
    }

    @PostMapping("/enrollCourse/{staffId}/{courseId}")
    public ResponseEntity<?> employerCourseEnroll(@PathVariable String staffId, @PathVariable Integer courseId) {
        if (staffId != null && courseId != null) {
            try {
                long cId = courseId.longValue(); // Implicit conversion from Integer to long
                EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
                if (employeeDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Employee not found with the given StaffId.");
                }

                // Retrieve the EmployeeDTO associated with the courseId
                EmployeeDTO courseOwner = courseService.getEmployeeByCourseId(cId);

                CourseDTO courseDTO = new CourseDTO();
                courseDTO.setId(cId);
                courseDTO.setEmployeeDTO(courseOwner);

                EmployeeDTO newemployeeDTO = new EmployeeDTO();
                newemployeeDTO.setSr(employeeDTO.getSr());

                LearningCourseDTO learningCourseDTO = new LearningCourseDTO();
                learningCourseDTO.setCourseDTOA(courseDTO);
                learningCourseDTO.setEmployeeDTO(newemployeeDTO);
                learningCourseDTO.setStartDate(LocalDate.now());

                learningCourseRepository.save(learningCourseDTO);
                System.out.println("Enrollment saved successfully.");

                studentService.sendEnrollCourseNotificationToInstructor(staffId, courseDTO);
                System.out.println("Notification sent.");

                return ResponseEntity.ok(Map.of("Message", "Student Enroll Is successfully"));
            } catch (NumberFormatException e) {
                System.err.println("NumberFormatException: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid StaffId format!");
            } catch (Exception e) {
                System.err.println("Exception: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while enrolling the course.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("StaffId And Course Id Are Not Defined!");
        }
    }


    @PostMapping("/unenrollCourse/{staffId}/{courseId}")
    public ResponseEntity<?> employerCourseUnEnroll(@PathVariable String staffId, @PathVariable Integer courseId) {
        if (staffId != null && courseId != null) {
            try {
                // Find the employee by staff ID
                EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
                if (employeeDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found!");
                }

                CourseDTO courseDTO = courseRepository.findById(courseId.longValue()).orElse(null);
                if (courseDTO == null || !courseDTO.isApproved()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found or not approved!");
                }

                LearningCourseDTO learningCourseDTO = learningCourseRepository.findByEmployeeDTOAndCourseDTOA_IdAndDeletedFalse(employeeDTO, courseDTO.getId());
                if (learningCourseDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Enrollment not found!");
                }

                // Mark the course as deleted (soft delete)
                learningCourseDTO.setDeleted(1);
                learningCourseRepository.save(learningCourseDTO);

                // Send unenrollment notification
                //studentService.sendUnenrollCourseNotificationToInstructor(staffId, courseDTO);

                return ResponseEntity.ok(Map.of("Message", "Student Unenrolled Successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("StaffId and Course Id are required!");
        }
    }

//    @GetMapping("/enrollCourses/{staffId}")
//    public List<CourseDTO> getCoursesByEmployeeId(@PathVariable String staffId) {
//        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
//        Long id = employeeDTO.getSr();
//        List<LearningCourseDTO> courses = learningCourseService.getCoursesByEmployeeId(id);
//        List<CourseDTO> learnings = new ArrayList<>();
//        for (LearningCourseDTO dto : courses) {
//            learnings.add(dto.getCourseDTOA());
//        }
//        return learnings;
//    }
@GetMapping("/examAnswerCount/{staffId}/{courseId}")
public ExamAnswerCountModel getEnrollCountByEmployeeIdAndCourseId(@PathVariable String staffId, @PathVariable Long courseId) {
    return examResultServiceService.countUsersByStaffIdAndCourseId(staffId, courseId, "fail");
}
    @GetMapping("/enrollCourses/{staffId}")
    public List<CourseDTO> getCoursesByEmployeeId(@PathVariable String staffId) {
        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
        Long id = employeeDTO.getSr();
        List<LearningCourseDTO> courses = learningCourseService.getCoursesByEmployeeIdAndStatus(id);
        List<CourseDTO> learnings = new ArrayList<>();
        for (LearningCourseDTO dto : courses) {
            learnings.add(dto.getCourseDTOA());
        }
        return learnings;
    }
    @GetMapping("/certificateCourses/{staffId}")
    public List<CourseDTO> getCertificateCoursesByEmployeeId(@PathVariable String staffId) {
        // Fetch the employee details using staffId
        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);

        // Fetch the list of exam results for the employee with status "pass"
        List<ExamResultDTO> courses = examResultServiceService.getCoursesByEmployeeIdAndStatus(employeeDTO.getStaffId(), "pass");

        // Initialize the list to hold course details
        List<CourseDTO> learnings = new ArrayList<>();

        // Iterate over the exam results
        for (ExamResultDTO dto : courses) {
            // Find the course by its ID
            Optional<CourseDTO> courseOptional = courseRepository.findById(dto.getCourseId());

            // If the course is present, add it to the list
            courseOptional.ifPresent(learnings::add);
        }

        // Return the list of courses
        return learnings;
    }



    @GetMapping(value = "/getCourseById/{courseId}", produces = "application/json")
    public CourseModel getAllCourses(ModelMap model, @PathVariable String courseId) {
        Long id=convertToLong(courseId);
        return studentService.getCourseById(id);
    }

    @GetMapping("/exists/{courseId}/{staffId}")
    public ResponseEntity<Boolean> checkEmployeeExists(@PathVariable String courseId,@PathVariable String staffId) {
        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
        Long id = employeeDTO.getSr();
        Long cId=convertToLong(courseId);
        boolean exists = learningCourseService.doesEmployeeExist(cId,id);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    @GetMapping("/course_count/{courseId}")
    public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId) {
        Long count = courseService.getEnrollmentCount(courseId);
        return ResponseEntity.ok(count);
    }
    @GetMapping("/course_countNg/{courseId}")
    public ResponseEntity<Long> getEnrollmentCountNodupli(@PathVariable Long courseId) {
        Long count = courseService.getEnrollmentCountNodupli(courseId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/enrolled-user/{courseId}")
    public List<EmployeeDTO> getEmployeesByCourseId(@PathVariable Long courseId) {
        return learningCourseService.getEmployeesByCourseId(courseId);
    }
    @GetMapping("/enrolled-time/{courseId}/{staffId}")
    public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId, @PathVariable String staffId) {
        long count = learningCourseService.countEnrollments(courseId, staffId);
        return ResponseEntity.ok(count);
    }
}