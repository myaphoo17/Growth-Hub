package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.StudentAssignmentService;
import com.E_Learnig.System.DTO.StudentAssignment;
import com.E_Learnig.System.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-assignments")
@CrossOrigin
@RequiredArgsConstructor
public class StudentAssignmentController {

    @Autowired
    private StudentAssignmentService studentAssignmentService;

    private final StorageService storageService;

    @GetMapping("/{id}")
    public ResponseEntity<StudentAssignment> getStudentAssignmentById(@PathVariable Long id) {
        Optional<StudentAssignment> studentAssignment = studentAssignmentService.getStudentAssignmentById(id);
        return studentAssignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public StudentAssignment createStudentAssignment(@RequestBody StudentAssignment studentAssignment) {
        return studentAssignmentService.createStudentAssignment(studentAssignment);
    }

    @PostMapping("/upload")
    public ResponseEntity<StudentAssignment> uploadAssignment(
            @RequestParam("instructorAssignmentId") Long instructorAssignmentId,
            @RequestParam("studentStaffId") String studentStaffId,
            @RequestParam("fileType") String fileType,
            @RequestParam("file") MultipartFile file) throws IOException {
        storageService.store(file);
        StudentAssignment studentAssignment = studentAssignmentService.uploadAssignment(
                instructorAssignmentId, studentStaffId, file.getOriginalFilename());

        return ResponseEntity.ok(studentAssignment);
    }

    @GetMapping("/by-assignment/{assignmentId}")
    public ResponseEntity<List<StudentAssignment>> getStudentAssignmentsByAssignmentId(@PathVariable Long assignmentId) {
        List<StudentAssignment> assignments = studentAssignmentService.getStudentAssignmentsByAssignmentId(assignmentId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<StudentAssignment>> getStudentAssignmentsByStudentId(@PathVariable String studentId) {
        List<StudentAssignment> studentAssignments = studentAssignmentService.getStudentAssignmentsByStudentId(studentId);
        return ResponseEntity.ok(studentAssignments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentAssignment(@PathVariable Long id) {
        studentAssignmentService.deleteStudentAssignment(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/download/{id}")
//    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
//        Optional<StudentAssignment> assignment = studentAssignmentService.getStudentAssignmentById(id);
//        if (assignment.isPresent()) {
//            byte[] data = assignment.get().getData();
//            String fileName = "assignment_" + id + ".zip";
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(data);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/download/{assignmentId}")
//    public ResponseEntity<byte[]> downloadFile(@PathVariable Long assignmentId) {
//        // Assuming you have logic to fetch the file from your storage
//        byte[] fileContent = ...; // Retrieve file content as byte array
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//        headers.setContentDispositionFormData("attachment", "assignment_" + assignmentId + ".zip");
//        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
//    }

}
