package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.CertificateResultService;
import com.E_Learnig.System.DAO.Service.ExamResultService;
import com.E_Learnig.System.DTO.CertificateResultDTO;
import com.E_Learnig.System.DTO.ExamResultDTO;
import com.E_Learnig.System.Model.CertificateResultModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/certificate-results")
public class CertificateResultController {

    @Autowired
    private CertificateResultService certificateResultService;

    @Autowired
    private ExamResultService examResultService;

    private static final Logger logger = Logger.getLogger(CertificateResultController.class.getName());

    @PostMapping("/save")
    public ResponseEntity<?> saveCertificateResult(@RequestBody CertificateResultModel certificateResultModel) {
        CertificateResultDTO certificateResultDTO = certificateResultService.saveCertificateData(certificateResultModel);
        return ResponseEntity.ok(certificateResultDTO);
    }

//    @GetMapping("/summary/{courseId}/{staffId}")
//    public ResponseEntity<List<CertificateResultModel>> getCertificateSummary(@PathVariable Long courseId, @PathVariable String staffId) {
//        List<CertificateResultModel> summaries = certificateResultService.getCertificateSummaryByCourseIdAndStaffId(courseId, staffId);
//        return summaries != null && !summaries.isEmpty() ? ResponseEntity.ok(summaries) : ResponseEntity.notFound().build();
//    }

    @GetMapping("/summary/{courseId}/{staffId}")
    public ResponseEntity<List<CertificateResultModel>> getCertificateSummary(@PathVariable Long courseId, @PathVariable String staffId) {
        List<CertificateResultModel> summaries = certificateResultService.getCertificateSummaryByCourseIdAndStaffId(courseId, staffId);
        return summaries != null && !summaries.isEmpty() ? ResponseEntity.ok(summaries) : ResponseEntity.notFound().build();
    }

    @GetMapping("/image/{certificateId}")
    public ResponseEntity<String> getCertificateImage(@PathVariable Long certificateId) {
        String base64Image = certificateResultService.getCertificateImageById(certificateId);
        if (base64Image != null) {
            return ResponseEntity.ok(base64Image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/exam-result/{staffId}/{courseId}")
    public ExamResultDTO getExamResultByStaffIdAndCourseId(@PathVariable String staffId, @PathVariable Long courseId) {
        return certificateResultService.getExamResultByStaffIdAndCourseId(staffId, courseId);
    }

    @GetMapping("/result")
    public ResponseEntity<ExamResultDTO> getExamResult(
            @RequestParam String staffId,
            @RequestParam Long courseId) {
        ExamResultDTO examResult = examResultService.findByStaffIdAndCourseIdAndStatus(staffId, courseId, "Pass");
        if (examResult != null) {
            return ResponseEntity.ok(examResult);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
