package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.CertificateDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<CertificateDTO, Long> {
    List<CertificateDTO> findByInstructorStaffId(String staffId);
}
