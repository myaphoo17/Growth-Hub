package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.LearningCourseRepository;
import com.E_Learnig.System.DAO.Service.InstructorAssignmentService;
import com.E_Learnig.System.DAO.Service.StudentAssignmentService;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.Exception.ResourceNotFoundException;
import com.E_Learnig.System.service.StorageService;
import com.cloudinary.api.exceptions.NotFound;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/instructor-assignments")
@CrossOrigin
@RequiredArgsConstructor
public class InstructorAssignmentController {

    @Autowired
    private InstructorAssignmentService instructorAssignmentService;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    StudentAssignmentService studentAssignmentService;

    private final StorageService storageService;

    private static final Logger logger = Logger.getLogger(InstructorAssignmentController.class.getName());

//    @GetMapping("/by-assignment/{id}/student-assignments")
//    public ResponseEntity<List<StudentAssignment>> getAllStudentAssignmentsByAssignmentId(@PathVariable Long id) {
//        List<StudentAssignment> studentAssignments = studentAssignmentService.getStudentAssignmentsByAssignmentId(id);
//        return ResponseEntity.ok(studentAssignments);
//    }

    @GetMapping("/by-assignment/{id}/student-assignments")
    public ResponseEntity<List<StudentAssignment>> getAllStudentAssignmentsByAssignmentId(@PathVariable Long id) {
        List<StudentAssignment> studentAssignments = studentAssignmentService.getStudentAssignmentsByAssignmentId(id);
        if (studentAssignments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(studentAssignments);
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);

        if (file == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }



    @GetMapping
    public List<InstructorAssignment> getAllInstructorAssignments() {
        return instructorAssignmentService.getAllInstructorAssignments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstructorAssignment> getInstructorAssignmentById(@PathVariable Long id) {
        Optional<InstructorAssignment> instructorAssignment = instructorAssignmentService.getInstructorAssignmentById(id);
        return instructorAssignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createInstructorAssignment(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        String dueDate = (String) payload.get("dueDate");
        String assignmentCreatorId = (String) payload.get("assignmentCreatorId");
        Long courseId = Long.valueOf((String) payload.get("courseId"));

        if (title == null || description == null || assignmentCreatorId == null || courseId == null) {
            return ResponseEntity.badRequest().body("Invalid input data");
        }

        LocalDate parsedDueDate;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            parsedDueDate = LocalDate.parse(dueDate, formatter);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format");
        }

        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(assignmentCreatorId);
        if (employeeDTO == null) {
            return ResponseEntity.badRequest().body("Invalid assignment creator ID");
        }

        CourseDTO courseDTO = courseRepository.findById(courseId).orElse(null);
        if (courseDTO == null) {
            return ResponseEntity.badRequest().body("Invalid course ID");
        }

        InstructorAssignment assignment = new InstructorAssignment();
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setDueDate(parsedDueDate.atStartOfDay());
        assignment.setInstructor(employeeDTO);
        assignment.setCourse(courseDTO);

        InstructorAssignment savedAssignment = instructorAssignmentService.createInstructorAssignment(assignment);
        return ResponseEntity.ok(savedAssignment);
    }
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<InstructorAssignment>> getAssignmentsByCourseId(@PathVariable Long courseId) {
        List<InstructorAssignment> assignments = instructorAssignmentService.getAssignmentsByCourseId(courseId);
        return ResponseEntity.ok(assignments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructorAssignment(@PathVariable Long id) {
        try {
            instructorAssignmentService.deleteInstructorAssignment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Unexpected error deleting assignment with ID: " + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
