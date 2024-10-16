package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Service.CertificateService;
import com.E_Learnig.System.DAO.Service.CloudinaryService;
import com.E_Learnig.System.DTO.CertificateDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin
public class CertificateController {

    @Autowired
    private CertificateService certificateService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private EmployeeRepository employeeRepository;

    private static final Logger logger = Logger.getLogger(CertificateController.class.getName());

    @PostMapping("/uploadMultiple")
    public ResponseEntity<?> uploadMultipleCertificates(@RequestParam("file") MultipartFile file, @RequestParam("instructorId") String instructorId) {
        try {
            EmployeeDTO instructor = employeeRepository.findByStaffId(instructorId);
            if (instructor == null) {
                return ResponseEntity.badRequest().body("Invalid instructor ID");
            }

            CertificateDTO certificate = new CertificateDTO();
            certificate.setData(file.getBytes());
            certificate.setInstructor(instructor);
            certificateService.saveCertificate(certificate);
            return new ResponseEntity<>(certificate, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<CertificateDTO> certificate = certificateService.getImage(id);
        return certificate.map(value -> ResponseEntity.ok().body(value.getData()))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByInstructorId(@PathVariable String instructorId) {
        List<CertificateDTO> certificates = certificateService.getCertificatesByInstructorId(instructorId);
        return ResponseEntity.ok(certificates);
    }




    //    @GetMapping
//    public ResponseEntity<List<CertificateDTO>> getAllCertificates() {
//        List<CertificateDTO> certificates = certificateService.getAllCertificates();
//        return ResponseEntity.ok(certificates);
//    }
}


