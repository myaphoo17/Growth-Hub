package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.GradeService;
import com.E_Learnig.System.Model.GradeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @PostMapping("/saveGrade")
    public ResponseEntity<?> saveGrades(@RequestBody List<GradeModel> gradeModels) {
        gradeService.saveGrades(gradeModels);
        return ResponseEntity.ok("Grades saved successfully");
    }

    @GetMapping("/grade/{courseId}")
    public ResponseEntity<List<GradeModel>> getGradesByCourseId(@PathVariable Long courseId) {
        List<GradeModel> grades = gradeService.getGradesByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }

    // Endpoint to save and update grades for a specific course
    @PostMapping("/saveAndUpdate/{courseId}")
    public ResponseEntity<?> saveAndUpdateGrades(
            @PathVariable("courseId") long courseId,
            @RequestBody List<GradeModel> gradeModels) {
        try {
            gradeService.saveAndUpdateGrades(courseId, gradeModels);
            return ResponseEntity.ok("Grades saved and updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving and updating grades: " + e.getMessage());
        }
    }

}
