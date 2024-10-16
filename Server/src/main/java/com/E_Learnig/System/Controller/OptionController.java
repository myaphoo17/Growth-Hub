package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.OptionService;
import com.E_Learnig.System.Model.OptionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/option")
public class OptionController {

    @Autowired
    OptionService optionService;

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<?> addOption(@RequestBody @Validated OptionModel optionModel, BindingResult bs){
        if (bs.hasErrors()) {
            return ResponseEntity.badRequest().body(bs.getAllErrors());
        }
        long status = optionService.addOption(optionModel);
        if (status == 1) {
            return ResponseEntity.ok("Option added successfully");
        } else {
            return ResponseEntity.status(500).body("Option addition failed");
        }
    }

}


