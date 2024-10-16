package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.StudentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAssignmentRepository extends JpaRepository<StudentAssignment, Long> {
    @Query("SELECT sa FROM StudentAssignment sa JOIN FETCH sa.student")
    List<StudentAssignment> findAllWithStudentDetails();

    List<StudentAssignment> findByInstructorAssignmentId(Long instructorAssignmentId);

    @Query("SELECT sa FROM StudentAssignment sa WHERE sa.student.staffId = :studentId")
    List<StudentAssignment> findByStudentId(String studentId);



}
