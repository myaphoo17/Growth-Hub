package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CertificateResultRepository;
import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.ExamResultRepository;
import com.E_Learnig.System.DTO.CertificateResultDTO;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.Model.CertificateResultModel;
import com.E_Learnig.System.Model.ExamResultModel;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class CertificateResultService {

    @Autowired
    private CertificateResultRepository certificateResultRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public ExamResultDTO getExamResultByStaffIdAndCourseId(String staffId, Long courseId) {
        return examResultRepository.findByStaffIdAndCourseIdAndStatus(staffId, courseId, "Pass");
    }
    public CertificateResultDTO saveCertificateData(CertificateResultModel certificateResultModel) {
        // Check if the record already exists
        Optional<CertificateResultDTO> existingRecord = certificateResultRepository
                .findByStaffIdAndCourseId(certificateResultModel.getStaffId(), certificateResultModel.getCourseId());

        if (existingRecord.isPresent()) {
            // If the record exists, return it or handle it accordingly
            return existingRecord.get();
        } else {
            // If the record does not exist, save the new one
            CertificateResultDTO certificateResultDTO = new CertificateResultDTO();
            certificateResultDTO.setStaffId(certificateResultModel.getStaffId());
            certificateResultDTO.setCourseId(certificateResultModel.getCourseId());
            certificateResultDTO.setCertificateId(certificateResultModel.getCertificateId());
            certificateResultDTO.setStatus(certificateResultModel.getStatus());
            certificateResultDTO.setGrade(certificateResultModel.getGrade());
            certificateResultDTO.setStaffName(certificateResultModel.getStaffName());
            certificateResultDTO.setCourseName(certificateResultModel.getCourseName());
            certificateResultDTO.setImage(certificateResultModel.getImage());

            return certificateResultRepository.save(certificateResultDTO);
        }
    }

//    public List<CertificateResultModel> getCertificateSummaryByCourseIdAndStaffId(Long courseId, String staffId) {
//        return certificateResultRepository.findSummaryByCourseIdAndStaffId(courseId, staffId);
//    }

    public List<CertificateResultModel> getCertificateSummaryByCourseIdAndStaffId(Long courseId, String staffId) {
        return certificateResultRepository.findSummaryByCourseIdAndStaffId(courseId, staffId);
    }


    public String getCertificateImageById(Long certificateId) {
        List<String> images = certificateResultRepository.findImagesById(certificateId);
        if (images.isEmpty()) {
            return null;
        } else if (images.size() > 1) {
            // Handle case where multiple results are returned
            // You might want to log this situation or take specific actions
            // For now, just return the first result
            return images.get(0);
        }
        return images.get(0);
    }



}
