package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.UploadFilesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UploadFilesRepository extends JpaRepository<UploadFilesDTO,Long> {
    @Query("SELECT u FROM UploadFilesDTO u WHERE u.courseDTO.id = :courseId")
    List<UploadFilesDTO> findAllByCourseId(@Param("courseId") Long courseId);

    Optional<UploadFilesDTO> findById(@Param("id") Long id);
}
