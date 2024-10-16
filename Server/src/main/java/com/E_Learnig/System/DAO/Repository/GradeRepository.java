package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.GradeDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<GradeDTO, Long> {
    List<GradeDTO> findByCourse_Id(long courseId);
    List<GradeDTO> findByCourseId(Long courseId);
}
