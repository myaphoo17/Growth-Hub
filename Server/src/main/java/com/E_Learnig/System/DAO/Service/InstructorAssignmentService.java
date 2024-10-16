package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.InstructorAssignmentRepository;
import com.E_Learnig.System.DAO.Repository.StudentAssignmentRepository;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.InstructorAssignment;
import com.E_Learnig.System.DTO.StudentAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructorAssignmentService {

    @Autowired
    InstructorAssignmentRepository instructorAssignmentRepository;
    @Autowired
    StudentAssignmentRepository studentAssignmentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CourseRepository courseRepository;

    public List<InstructorAssignment> getAllInstructorAssignments() {
        return instructorAssignmentRepository.findAll();
    }

    public Optional<InstructorAssignment> getInstructorAssignmentById(Long id) {
        return instructorAssignmentRepository.findById(id);
    }

    public InstructorAssignment createInstructorAssignment(InstructorAssignment instructorAssignment) {
        return instructorAssignmentRepository.save(instructorAssignment);
    }

    public void deleteInstructorAssignment(Long id) {
        // First, delete all student assignments associated with this instructor assignment
        List<StudentAssignment> studentAssignments = studentAssignmentRepository.findByInstructorAssignmentId(id);
        studentAssignments.forEach(studentAssignment -> studentAssignmentRepository.deleteById(studentAssignment.getId()));

        instructorAssignmentRepository.deleteById(id);
    }

    public List<InstructorAssignment> getAssignmentsByCourseId(Long courseId) {
        return instructorAssignmentRepository.findAllByCourseId(courseId);
    }
}
