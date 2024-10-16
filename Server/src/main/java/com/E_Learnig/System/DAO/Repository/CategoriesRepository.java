package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.DTO.CourseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;


@Repository
public interface CategoriesRepository extends JpaRepository<CategoriesDTO,Long> {

    @Query("SELECT DISTINCT c FROM CategoriesDTO c JOIN FETCH c.courseDTO cd WHERE cd.isApproved = true")
    List<CategoriesDTO> findAllCategoriesWithApprovedCourses();


}
