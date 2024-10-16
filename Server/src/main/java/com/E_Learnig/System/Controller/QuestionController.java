package com.E_Learnig.System.Controller;
import com.E_Learnig.System.DAO.Service.QuestionService;
import com.E_Learnig.System.Model.QuestionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/question")
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @PostMapping(value = "/",produces = "application/json")
    public ResponseEntity<?> addQuestion(@RequestBody @Validated QuestionModel questionModel, BindingResult bs){
        if (bs.hasErrors()) {
            return ResponseEntity.badRequest().body(bs.getAllErrors());
        }
        long status = questionService.addQuestion(questionModel);
        if (status == 1) {
            return ResponseEntity.ok("Question added successfully");
        } else {
            return ResponseEntity.status(500).body("Question addition failed");
        }
    }

}

