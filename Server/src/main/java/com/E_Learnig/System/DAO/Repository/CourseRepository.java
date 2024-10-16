package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseDTO, Long> {
    List<CourseDTO> findByIsApprovedTrue();
    List<CourseDTO> findByIsApprovedFalse();
    List<CourseDTO> findByIsApprovedTrueAndEmployeeDTO_Sr(Long courseCreatorId);
    List<CourseDTO> findByIsApprovedFalseAndEmployeeDTO_Sr(Long courseCreatorId);
    List<CourseDTO> findByTitleContainingIgnoreCaseAndIsApprovedTrue(String query);
    List<CourseDTO> findByEmployeeDTO_Sr(Long courseCreatorId);
    @Query("SELECT c FROM CourseDTO c WHERE c.isApproved = true AND c.title LIKE %:title%")
    List<CourseDTO> searchApprovedCoursesByTitle(@Param("title") String title);
    boolean existsByIdAndEmployeeDTO_Sr(Long courseId,Long employeeId);
    @Query("SELECT COUNT(l) FROM LearningCourseDTO l WHERE l.courseDTOA.id = :courseId")
    Long countEnrollmentsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(DISTINCT l.courseDTOA.id) FROM LearningCourseDTO l WHERE l.employeeDTO.sr = :staffId")
    Long countUniqueCoursesByStaffId(@Param("staffId") Long staffId);

//    Optional<CourseDTO> findById(Long id);

}
