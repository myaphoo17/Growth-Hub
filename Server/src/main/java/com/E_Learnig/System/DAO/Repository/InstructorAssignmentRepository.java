package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.InstructorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorAssignmentRepository extends JpaRepository<InstructorAssignment, Long> {
    List<InstructorAssignment> findAllByCourseId(Long courseId);
}
