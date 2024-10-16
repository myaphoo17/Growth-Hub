package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionDTO,Long> {
    @Query("SELECT q FROM QuestionDTO q WHERE q.exam.id = :examId")
    List<QuestionDTO> findByExamId(@Param("examId") long examId);

    List<QuestionDTO> findAllByExam(ExamDTO exam);

}
