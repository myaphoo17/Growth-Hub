package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import com.E_Learnig.System.DTO.StudentAnswerDTO;
import com.E_Learnig.System.Model.StudentAnswerModel;
import com.E_Learnig.System.Model.StudentAnswerResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswerDTO,Long> {
    List<StudentAnswerDTO> findByStaffId(String staffId);
    boolean existsByStaffIdAndCourseId_Id(String staffId, long courseId);
    boolean existsByExamIdAndStaffId(Long examId, String staffId);
    List<StudentAnswerDTO> findByExamIdAndStaffId(long examId, String staffId);

    List<StudentAnswerDTO> findByCourseIdAndStaffId(long courseId, String staffId);

    @Modifying
    @Transactional
    @Query("DELETE FROM StudentAnswerDTO sa WHERE sa.option.id = :optionId")
    void deleteByOptionId(@Param("optionId") long optionId);
}

