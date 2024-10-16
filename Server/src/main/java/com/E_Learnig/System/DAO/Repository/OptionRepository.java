package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.OptionDTO;
import com.E_Learnig.System.DTO.QuestionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository  extends JpaRepository<OptionDTO,Long> {
    @Query("SELECT o FROM OptionDTO o WHERE o.question.id = :questionId")
    List<OptionDTO> findByQuestionId(@Param("questionId") long questionId);

    List<OptionDTO> findAllByQuestion(QuestionDTO question);
}

