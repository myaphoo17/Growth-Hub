package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Repository.ExamRepository;
import com.E_Learnig.System.DAO.Service.ExamService;
import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.Exception.ResourceNotFoundException;
import com.E_Learnig.System.Model.ExamModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/exam")
public class ExamController {

    @Autowired
    ExamService examService;
    @Autowired
    ExamRepository examRepository;

    @PostMapping(produces = "application/json")
    public ResponseEntity<String> addExam(@RequestParam Long courseId, @RequestBody @Validated ExamModel examModel, BindingResult bs) {
        if (bs.hasErrors()) {
            return ResponseEntity.badRequest().body("Invalid input: " + bs.getAllErrors().toString());
        }

        try {
            int status = examService.addExam(courseId, examModel);
            if (status == 1) {
                return ResponseEntity.ok("Exam added successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Exam addition failed");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ExamModel> getExamDetailsByCourseId(@PathVariable Long courseId) {
        try {
            ExamModel examModel = examService.getExamDetailsByCourseId(courseId);
            return ResponseEntity.ok(examModel);
        } catch (ResourceNotFoundException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{courseId}")
    public ResponseEntity<ExamModel> updateExam(@PathVariable long courseId, @RequestBody ExamDTO examDTO) {
        ExamModel updatedExam = examService.updateExam(courseId, examDTO);
        return ResponseEntity.ok(updatedExam);
    }
    @GetMapping("/hasExam/{courseId}")
    public ResponseEntity<Boolean> getHasExamByCourseId(@PathVariable Long courseId) {
        boolean exists = examRepository.existsByCourseId(courseId);
        return ResponseEntity.ok(exists);
    }
}



