package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.LearningCourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LearningCourseRepository extends JpaRepository<LearningCourseDTO, Long> {

    List<LearningCourseDTO> findByEmployeeDTO_SrAndDeleted(Long employeeId, Integer deleted);

    List<LearningCourseDTO> findByEmployeeDTO_SrAndAnswerExamFalse(Long employeeId);

    List<LearningCourseDTO> findByCourseDTOA_Id(Long courseId);
    Optional<LearningCourseDTO> findByEmployeeDTOAndCourseDTOA_Id(EmployeeDTO employee, Long courseId);

    long countByCourseDTOA_Id(Long courseId);

    LearningCourseDTO findByEmployeeDTOAndCourseDTOA_IdAndDeletedFalse(EmployeeDTO employeeDTO, Long courseId);
    LearningCourseDTO findByEmployeeDTO_SrAndCourseDTOA_Id(Long sr, Long courseId);
    List<LearningCourseDTO> findByEmployeeDTO_StaffId(String employeeId);

    boolean existsByCourseDTOAIdAndEmployeeDTO_SrAndDeleted(Long courseId, Long employeeId, Integer deleted);

    @Query("SELECT e FROM LearningCourseDTO lc JOIN lc.employeeDTO e WHERE lc.courseDTOA.id = :courseId")
    List<EmployeeDTO> findEmployeesByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(lc) FROM LearningCourseDTO lc WHERE lc.employeeDTO.staffId = :staffId AND lc.courseDTOA.id = :courseId")
    long countEnrollmentsByCourseIdAndStaffId(@Param("courseId") Long courseId, @Param("staffId") String staffId);

    @Query("SELECT c FROM CourseDTO c WHERE c.employeeDTO.staffId = :staffId")
    List<CourseDTO> findCoursesByStaffId(@Param("staffId") String staffId);

    @Query("SELECT COUNT(e) " +
            "FROM LearningCourseDTO e " +
            "WHERE e.courseDTOA.id = :courseId " +
            "AND FUNCTION('YEAR', e.startDate) = :year")
    Long countEnrollmentsByCourseIdAndYear(@Param("courseId") Long courseId, @Param("year") int year);

    @Query("SELECT c FROM CourseDTO c")
    List<CourseDTO> findAllCourses();

}
