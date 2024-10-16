package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CertificateRepository;
import com.E_Learnig.System.DAO.Repository.CertificateResultRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DTO.CertificateDTO;
import com.E_Learnig.System.DTO.CertificateResultDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CertificateService {

    @Autowired
    CertificateRepository certificateRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CertificateResultRepository certificateResultRepository;

    public CertificateDTO saveCertificate(CertificateDTO certificate) {
        return certificateRepository.save(certificate);
    }

    public Optional<CertificateDTO> getImage(Long id){
        return certificateRepository.findById(id);
    }

    public List<CertificateDTO> getCertificatesByInstructorId(String instructorId) {
        return certificateRepository.findByInstructorStaffId(instructorId);
    }

}
