package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CertificateResultDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.Model.CertificateResultModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateResultRepository extends JpaRepository<CertificateResultDTO, Long> {

    Optional<CertificateResultDTO> findByStaffIdAndCourseId(String staffId, Long courseId);

    List<CertificateResultDTO> findAllByCourseIdAndStaffId(Long courseId, String staffId);


    @Query("SELECT new com.E_Learnig.System.Model.CertificateResultModel(c.certificateId, c.staffName, c.courseName, c.grade, c.image) " +
            "FROM CertificateResultDTO c WHERE c.courseId = :courseId AND c.staffId = :staffId")
    List<CertificateResultModel> findSummaryByCourseIdAndStaffId(@Param("courseId") Long courseId, @Param("staffId") String staffId);
    @Query("SELECT c.image FROM CertificateResultDTO c WHERE c.certificateId = :certificateId")
    List<String> findImagesById(@Param("certificateId") Long certificateId);

}
