package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.Model.ExamAnswerCountModel;
import com.E_Learnig.System.Model.ExamResultModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResultDTO, Long> {
    List<ExamResultDTO> findAllByExamIdIn(List<Long> examIds);
    ExamResultDTO findByStaffIdAndCourseIdAndStatus(String staffId, Long courseId, String status);
    List<ExamResultDTO> findByStatus(String status);
    List<ExamResultDTO> findByCourseId(Long courseId);
    List<ExamResultDTO> findByStaffIdAndStatus(String staffId, String status);
    @Query("SELECT er.courseId AS courseId, er.staffId AS staffId, e.name AS staffName, er.grade AS grade, c.title AS courseName " +
            "FROM ExamResultDTO er " +
            "JOIN CourseDTO c ON er.courseId = c.id " +
            "JOIN EmployeeDTO e ON er.staffId = e.staffId " +
            "WHERE er.status = 'Pass'")
    List<ExamResultModel> findAllPassedExamResultsWithStaffName();

    @Query("SELECT er.courseId AS courseId, c.title AS courseName " +
            "FROM ExamResultDTO er " +
            "JOIN CourseDTO c ON er.courseId = c.id")
    List<CourseDTO> findCourseNames();

    @Query("SELECT new com.E_Learnig.System.Model.ExamAnswerCountModel(e.courseId, COUNT(e.staffId)) " +
            "FROM ExamResultDTO e WHERE e.staffId = :staffId AND e.courseId = :courseId AND e.status = :status " +
            "GROUP BY e.courseId")
    ExamAnswerCountModel countUsersByStaffIdAndCourseId(@Param("staffId") String staffId, @Param("courseId") Long courseId, @Param("status") String status);
    @Query("SELECT e.staffId FROM ExamResultDTO e WHERE e.courseId = :courseId AND e.status = :status")
    List<String> findStaffIdsByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") String status);

    List<ExamResultDTO> findByStaffIdInAndCourseId(List<String> staffIds, Long courseId);

}
