package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.InstructorAssignmentRepository;
import com.E_Learnig.System.DAO.Repository.LearningCourseRepository;
import com.E_Learnig.System.DAO.Repository.StudentAssignmentRepository;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.InstructorAssignment;
import com.E_Learnig.System.DTO.LearningCourseDTO;
import com.E_Learnig.System.DTO.StudentAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentAssignmentService {

    @Autowired
    private StudentAssignmentRepository studentAssignmentRepository;

    @Autowired
    LearningCourseRepository learningCourseRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    InstructorAssignmentRepository instructorAssignmentRepository;


    public List<StudentAssignment> getStudentAssignmentsByStudentId(String studentId) {
        return studentAssignmentRepository.findByStudentId(studentId);
    }

    public List<StudentAssignment> getStudentAssignmentsByAssignmentId(Long assignmentId) {
        return studentAssignmentRepository.findByInstructorAssignmentId(assignmentId);
    }

    public Optional<StudentAssignment> getStudentAssignmentById(Long id) {
        return studentAssignmentRepository.findById(id);
    }

    public StudentAssignment createStudentAssignment(StudentAssignment studentAssignment) {
        return studentAssignmentRepository.save(studentAssignment);
    }

    public void deleteStudentAssignment(Long id) {
        if (studentAssignmentRepository.existsById(id)) {
            studentAssignmentRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Assignment ID not found");
        }
    }

    public StudentAssignment uploadAssignment(Long instructorAssignmentId, String studentStaffId, String fileType) {
        InstructorAssignment instructorAssignment = instructorAssignmentRepository.findById(instructorAssignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid assignment ID"));

        EmployeeDTO student = employeeRepository.findByStaffId(studentStaffId);
        if (student == null) {
            throw new IllegalArgumentException("Invalid student ID");
        }

        StudentAssignment studentAssignment = new StudentAssignment();
        studentAssignment.setFileType(fileType);
        studentAssignment.setSubmittedDate(LocalDateTime.now());
        studentAssignment.setInstructorAssignment(instructorAssignment);
        studentAssignment.setStudent(student); // Set student ID
        return studentAssignmentRepository.save(studentAssignment);
    }

}
