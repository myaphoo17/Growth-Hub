package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.Model.ExamModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<ExamDTO,Long> {
    @Query("SELECT e FROM ExamDTO e WHERE e.course.id = :courseId")
    Optional<ExamDTO> findByCourseId(@Param("courseId") Long courseId);
    Optional<ExamDTO> findByCourseId(long courseId);
    boolean existsByCourseId(long courseId);
    List<ExamDTO> findByCourseIdIn(List<Long> courseIds);
}
